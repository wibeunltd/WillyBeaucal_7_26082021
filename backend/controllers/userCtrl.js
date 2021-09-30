// Imports
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
    const { firstName, lastName, email, password, confirmedPassword } = req.body

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
            const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
            return res.status(409).json({ message })
        }
        
        // Email disponible
        else {
            /* if (confirmedPassword !== password) {
                const error = new Error({
                    name: "Password don't match",
                    message: "les mots de passe saisis ne correspondent pas."
                })
                const message = `Une erreur s'est produite.`
                return res.status(400).json({ message, error: error })
            } */
            // Création de l'utilisateur
            User.create({
                firstName           : firstName,
                lastName            : lastName,
                email               : email,
                password            : password,
                confirmedPassword   : confirmedPassword,
                coverPicture        : `https://picsum.photos/1000/500`,
                profilePicture      : `https://eu.ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`,
                isAdmin             : role,
                registerId          : token.mail(email),
                loggedIn            : new Date(),
                lastLogin           : new Date(),
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
                    const message = `Une erreur s'est produite, l'envoi du mail de confirmation est impossible.`
                    return res.status(409).json({ message, error: error })
                })
            })
            .catch(err => {
                const errors = {}
                err.errors.forEach((error) => {
                    errors[error.path] = {
                        value: error.value,
                        errors: error.message
                    }
                })
                const message = `Une erreur s'est produite, l'inscription n'a pas pu aboutir correctement.`
                return res.status(409).json({ message, error: errors })
            })
        }
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible de vérifier le statut d'inscription.`
        return res.status(500).json({ message, error: error })
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
        if(!user) {
            const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
            return res.status(409).json({ message })
        }
        user.update({
            registerId : token.mail(email)
        })
        .then(() => {
            // Mail de confirmation
        const firstName     = user.firstName
        const createdAt     = moment(user.createdAt).format('LLLL')
        const registerId    = user.registerId

        mailer.registerActivationMail(email, firstName, createdAt, registerId)
        .then(() => {
            const message=`Le mail de confirmation à été renvoyé avec succès.`
            return res.status(200).json({ message })
        })
        .catch(error => {
            const message = `Une erreur s'est produite, l'envoi du mail de confirmation est impossible.`
            return res.status(409).json({ message, error: error })
        })
        })
        .catch(error => {
            const message = `Une erreur s'est produite, impossible de vérifier le statut d'inscription.`
            return res.status(409).json({ message, error: error })
        })
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
        return res.status(409).json({ message, data: error })
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
        if(!user) {
            const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
            return res.status(409).json({ message })
        }
        
        if(user.isRegisterActive == true) {
            const message = `Ce compte utilisateur est déjà confirmé. Profiter de nos services en vous authentifiant.`
            return res.status(409).json({ message })
        }

        if(user.registerId !== registerId ) {
            const message = `Une erreur s'est produite, impossible de vérifier le statut de confirmation.`
            return res.status(409).json({ message })
        }

        if(expired == true) {
            const message = `Une erreur s'est produite, le délai de confirmation d'inscription a expiré.`
            return res.status(498).json({ message })
        }

        user.update({
            isRegisterActive: true
        })
        .then(() => {
            const message = `L'activation de votre compte a aboutie avec succès.`
            return res.status(200).json({ message })
        })
        .catch(error => {
            const message = `Une erreur s'est produite, impossible de confirmer l'état d'activation du compte.`
            return res.status(409).json({ message, error: error })
        })
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible de confirmer l'activation du compte.`
        return res.status(500).json({ message, error: error })
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
            const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
            return res.status(401).json({ message })
        } else {
            bcrypt.compare(password, user.password)
            .then(valid => {
                if(valid) {
                    // Vérification de la confirmation d'enregistrement
                    if(user.isRegisterActive == false) {
                        const message = `Merci d'activer votre compte pour bénéficier de nos services.`
                        return res.status(201).json({ message })
                    }

                    user.update({
                        lastLogin   : user.loggedIn,
                        loggedIn    : new Date(),
                    })
                    .then(() => {
                        return res.status(200).json({
                            /* 'Status'            : "Logged in !",
                            'ID'                : user.id,
                            'IsAdmin'           : user.isAdmin,
                            'LastName'          : user.lastName,
                            'FirstName'         : user.firstName,
                            'Last Login'        : user.lastLogin,
                            'Logged In'         : user.loggedIn,
                            'Created at'        : user.createdAt,
                            'Updated at'        : user.updatedAt,
                            'IsRegisterActive'  : user.isRegisterActive, */
                            'User'              : user,
                            'Token'             : token.generate(user),
                        })
                    })
                    .catch(error => {
                        const message = `Une erreur s'est produite, impossible de se connecter.`
                        return res.status(409).json({ message, error: error })
                    })
                } else {
                    const message = `Une erreur s'est produite, impossible de vérifier le statut d'identification.`
                    return res.status(401).json({ message })
                }
            })
            .catch(error => {
                const message = `Une erreur s'est produite, impossible de vérifier l'état d'identification.`
                return res.status(409).json({ message, error: error })
            })
        }
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible de permettre l'identification'`
        return res.status(502).json({ message, error: error })
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
            const message = `Une erreur s'est produite, impossible de vérifier le profil utilisateur.`
            return res.status(404).json({ message })
        }
        return res.status(201).json(user)
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible d'initialiser le profil utilisateur.`
        return res.status(409).json({ message, error: error })
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
        attributes: [ 'id', 'firstName', 'lastName', 'email', 'password', 'biography', 'companyServices', 'coverPicture', 'profilePicture', 'createdAt', 'updatedAt' ],
        where: { id: userId }
    })
    .then(user => {
        if(!user) {
            const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
            return res.status(404).json({ message })
        }
        user.update({
            firstName       : (firstName ? firstName : user.firstName),
            lastName        : (lastName ? lastName : user.lastName),
            email           : (email ? email : user.email),
            password        : (password ? (bcrypt.hashSync(password, 10)) : user.password),
            biography       : (biography ? biography : user.biography),
            companyServices : (companyServices ? companyServices : user.companyServices),
            coverPicture    : (coverPicture ? coverPicture : user.coverPicture),
            profilePicture  : (profilePicture ? profilePicture : user.profilePicture)
        })
        .then(() => {
            return res.status(201).json(user)
        })
        .catch(err => {
            const errors = {}
            err.errors.forEach((error) => {
                errors[error.path] = {
                    value: error.value,
                    errors: error.message
                }
            })
            const message = `Une erreur s'est produite, impossible de terminer la mise à jour du profil utilisateur.`
            return res.status(400).json({ message, error: errors })
        })
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible d'initialiser la mise à jour du profil utilisateur.`
        return res.status(500).json({ message, error: error })
    })
}