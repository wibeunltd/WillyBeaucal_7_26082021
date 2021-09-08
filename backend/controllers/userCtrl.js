// Module requis
const bcrypt        = require('bcrypt')
const fs            = require('fs')
const { User }      = require('../models')
const mailer        = require('../utils/mailer')
const moment        = require('moment')
const token         = require('../utils/token')

// Date en français
moment.locale('fr')

// Variable d'environnement
require('dotenv').config

/**------------------------------------
 * Inscription d'un nouvel utilisateur
--------------------------------------*/
exports.register = (req, res, next) => {
    // Champs requête
    const { firstName, lastName, email, password } = req.body

    // Vérification en bdd de la présence de l'utilisateur (via son email)
    User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    .then(user => {
        // Gestion administrateur
        const role = (email == 'hello@groupomania.fr') ? true : false

        // Utilisateur présent en bdd
        if(user) {
            const message = `L'adresse email saisie ne peut pas être utilisée. Merci d'en choisir une autre.`
            return res.status(409).json({ message })
        }
        
        // Email disponible
        else {
            bcrypt.hash(password, 10)
            .then(hash => {
                // Création de l'utilisateur
                User.create({
                    firstName       : firstName,
                    lastName        : lastName,
                    email           : email,
                    password        : hash,
                    coverPicture    : `https://picsum.photos/1000/500`,
                    profilePicture  : `https://eu.ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`,
                    isAdmin         : role,
                    registerId      : token.mail(email),
                    loggedIn        : new Date(),
                    lastLogin       : new Date(),
                })
                .then(newUser => {

                    // Mail de confirmation
                    const createdAt     = moment(newUser.createdAt).format('LLLL')
                    const registerId    = newUser.registerId

                    mailer.registerActivationMail(email, firstName, createdAt, registerId)
                    .then(() => {

                        // Dossier utilisateur
                        fs.mkdir((`./public/users/${newUser.id}`), {recursive:true}, error =>{
                            if(error) {
                                return console.error(error);
                            }
                        })

                        // Inscription finalisée
                        const message = `L'inscription de l'utilisateur ${firstName} ${lastName} a aboutie avec succès.`
                        return res.status(201).json({ message })

                    })
                    .catch(error => {
                        const message = `Un problème serveur, ne permet pas l'envoi du mail de confirmation. Merci de réessayer ultérieurement.`
                        return res.status(500).json({ message, data: error })
                    })
                })
                .catch(error => {
                    const message = `L'inscription n'a pas pu aboutir correctement. Merci de réessayer ultérieurement.`
                    return res.status(500).json({ message, data: error })
                })
            })
            .catch(error => {
                const message = `Un problème serveur, ne permet pas la finalisation de l'inscription. Merci de réessayer ultérieurement.`
                return res.status(500).json({ message, data: error })
            })
        }
    })
    .catch(error => {
        const message = `Un problème serveur, ne permet pas la verification du statut d'inscription. Merci de réessayer ultérieurement.`
        return res.status(500).json({ message, data: error })
    })
}

/**------------------------------------
 * Renvoi du mail d'activation
--------------------------------------*/
exports.resendConfirmationMail = (req, res, next) => {
    // Champs requête
    const { email } = req.body

    // Vérification en bdd de la présence de l'utilisateur (via son email)
    User.findOne({
        where: { email: email }
    })
    .then(user => {
        user.update({
            registerId : token.mail(email)
        })
        .then(() => {
            // Mail de confirmation
        const firstName     = user.firstName
        const createdAt     = moment(newUser.createdAt).format('LLLL')
        const registerId    = user.registerId

        mailer.registerActivationMail(email, firstName, createdAt, registerId)
        .then(() => {
            const message=`Le mail de confirmation à été renvoyé avec succès.`
            return res.status(200).json({ message })
        })
        .catch(error => {
            const message = `Un problème serveur, ne permet pas l'envoi du mail de confirmation. Merci de réessayer ultérieurement.`
            return res.status(500).json({ message, data: error })
        })
        })
        .catch(error => {
            const message = `Un problème serveur, ne permet pas la mise à jour de l'ID d'inscription. Merci de réessayer ultérieurement.`
            return res.status(500).json({ message, data: error })
        })
    })
    .catch(error => {
        const message = `Un problème serveur, ne permet pas la verification de l'utilisateur. Merci de réessayer ultérieurement.`
        return res.status(500).json({ message, data: error })
    })
}

/**------------------------------------
 * Confirmation d'inscription
--------------------------------------*/
exports.confirmUserRegistration = (req, res, next) => {
    const email        = req.params.email
    const registerId   = req.params.registerId
    const expired      = token.mailIsExpire(registerId)
    
    // Vérification en bdd de l'utilisateur (via son email)
    User.findOne({
        where: { email: email }
    })
    .then(user => {
        if(user.isRegisterActive == true) {
            const message = `Le compte utilisateur est déjà actif. Vous pouvez profiter de nos services en vous connectant.`
            return res.status(409).json({ message })
        }

        if(user.registerId !== registerId ) {
            const message = `Les paramètres demandés sont incorrects. Merci de les vérifier.`
            return res.status(401).json({ message })
        }

        if(expired == true) {
            const message = `Le délai pour la confirmation d'inscription a été dépassé. Merci de demander l'envoi d'un nouveau mail`
            return res.status(403).json({ message })
        }

        user.update({
            isRegisterActive: true
        })
        .then(() => {
            const message = `L'activation de votre compte a aboutie avec succès.`
            return res.status(200).json({ message })
        })
        .catch(error => {
            const message = `Un problème serveur, ne permet pas l'activation de votre compte. Merci de réessayer ultérieurement.`
            return res.status(400).json({ message, data: error })
        })
    })
    .catch(error => {
        const message = `Les paramètres demandés sont incorrects. Merci de les vérifier. Si le problème persiste, merci de contacter l'administrateur.`
        return res.status(409).json({ message, data: error })
    });
}

/**------------------------------------
 * Connexion d'un utilisateur
--------------------------------------*/
exports.login = (req, res, next) => {
    // Champs requête
    const { email, password } = req.body

    // Vérification en bdd de l'utilisateur (via son email)
    User.findOne({
        where: { email: email }
    })
    .then(user => {
        if(!user) {
            const message = `Les informations d'identifications fournies sont invalides. Merci de vérifier vos saisies.`
            return res.status(401).json({ message })
        } else {
            bcrypt.compare(password, user.password)
            .then(valid => {
                if(valid) {
                    // Vérification de la confirmation d'enregistrement
                    if(user.isRegisterActive == false) {
                        const message = `Votre compte n'est pas activé. Afin de vous connecter, merci de l'activer via le lien reçu à l'adresse mail d'inscription.`
                        return res.status(201).json({ message })
                    }

                    user.update({
                        lastLogin : user.loggedIn,
                        loggedIn: new Date(),
                    })
                    .then(() => {
                        return res.status(200).json({
                            'Status'            : "Logged in !",
                            'ID'                : user.id,
                            'IsAdmin'           : user.isAdmin,
                            'LastName'          : user.lastName,
                            'FirstName'         : user.firstName,
                            'Last Login'        : user.lastLogin,
                            'Logged In'         : user.loggedIn,
                            'Created at'        : user.createdAt,
                            'Updated at'        : user.updatedAt,
                            'IsRegisterActive'  : user.isRegisterActive,
                            'Token'             : token.generate(user)
                        })
                    })
                    .catch(error => {
                        const message = `Un problème serveur, ne permet pas la connexion votre compte. Merci de réessayer ultérieurement.`
                        return res.status(501).json({ message, data: error })
                    })
                } else {
                    const message = `Les informations d'identifications fournies sont invalides. Merci de vérifier vos saisies.`
                    return res.status(401).json({ message })
                }
            })
            .catch(error => {
                const message = `Échec de la connexion, impossible d'accéder aux services en ligne. Merci de réessayer ultérieurement.`
                return res.status(501).json({ message, data: error })
            })
        }
    })
    .catch(error => {
        const message = `Échec de la connexion, impossible d'accéder aux services en ligne. Merci de réessayer ultérieurement.`
        return res.status(502).json({ message, data: error })
    })
}

/**---------------------------------------------------
 * Accès à un profil utilisateur - Route authentifiée
-----------------------------------------------------*/
exports.profile = (req, res, next) => {
    // Vérification en bdd de l'utilisateur (via son id)
    User.findOne({
        attributes: [ 'id', 'isAdmin', 'firstName', 'lastName', 'email', 'lastLogin', 'biography', 'companyServices', 'coverPicture', 'profilePicture', 'createdAt', 'updatedAt' ],
        where: { id: userId }
    })
    .then(user => {
        if(!user) {
            const message = `L'utilisateur demandé n'a pas été trouvé.`
            return res.status(404).json({ message })
        }
        return res.status(201).json(user)
    })
    .catch(error => {
        const message = `Échec de la connexion, impossible d'accéder aux services en ligne. Merci de réessayer ultérieurement.`
        return res.status(500).json({ message, data: error })
    })
}

/**--------------------------------------------------------
 * Mise à jour d'un profil utilisateur - Route authentifiée
----------------------------------------------------------*/
exports.profileUpdate = (req, res, next) => {
    // Champs requête
    const { firstName, lastName, email, password, biography, companyServices, coverPicture, profilePicture } = req.body
    // Vérification en bdd de l'utilisateur (via son id)
    User.findOne({
        attributes: [ 'id', 'firstName', 'lastName', 'email', 'biography', 'companyServices', 'coverPicture', 'profilePicture' ],
        where: { id: userId }
    })
    .then(user => {
        if(!user) {
            const message = `L'utilisateur demandé n'a pas été trouvé.`
            return res.status(404).json({ message })
        }
        user.update({
            firstName       : (firstName ? firstName : user.firstName),
            lastName        : (lastName ? lastName : user.lastName),
            email           : (email ? email : user.email),
            password        : (password ? password : user.password),
            biography       : (biography ? biography : user.biography),
            companyServices : (companyServices ? companyServices : user.companyServices),
            coverPicture    : (coverPicture ? coverPicture : user.coverPicture),
            profilePicture  : (profilePicture ? profilePicture : user.profilePicture)
        })
        .then(() => {
            return res.status(201).json(user)
        })
        .catch(error => {
            const message = `Un problème serveur, ne permet pas la mise à jour de vos informations. Merci de réessayer ultérieurement.`
            return res.status(400).json({ message, data: error })
        })
    })
    .catch(error => {
        const message = `Échec de la connexion, impossible d'accéder aux services en ligne. Merci de réessayer ultérieurement.`
        return res.status(500).json({ message, data: error })
    })

}