// Imports
const bcrypt        = require('bcrypt')
const fs            = require('fs')
const { User }      = require('../models')
const mailer        = require('../utils/mailer')
const moment        = require('moment')
const token         = require('../utils/token')
const upload        = require('../utils/upload')

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
        attributes: ['email', 'lastName', 'firstName'],
        where: { email: email }
    })
    .then(user => {
        // Gestion administrateur
        const adminStatus = (email == 'hello@groupomania.fr') ? true : false

        // Utilisateur présent en bdd
        if(user) {
            if(user.firstName == firstName && user.lastName == lastName) {
                const message = `Merci de prendre contact avec un administrateur afin d'effectuer votre inscription.`
                return res.status(409).json({ message })
            }
            const message = `L'adresse email saisie, n'est pas valide pour l'inscription.`
            return res.status(409).json({ message })
        } else {
            // Création de l'utilisateur
            User.create({
                firstName           : firstName,
                lastName            : lastName,
                email               : email,
                password            : password,
                confirmedPassword   : confirmedPassword,
                coverPicture        : null,
                profilePicture      : null,
                isAdmin             : adminStatus,
                emailToken          : token.mail(email),
                loggedIn            : new Date(),
                lastLogin           : new Date(),
            })
            .then(newUser => {
                // Mail de confirmation
                const createdAt     = moment(newUser.createdAt).format('LLLL')
                const emailToken    = newUser.emailToken

                mailer.registerActivationMail(email, firstName, createdAt, emailToken)
                .then(() => {

                    // Dossier utilisateur
                    fs.mkdir((`./public/users/${newUser.id}`), {recursive:true}, error =>{
                        // Téléchargement et enregistrement de l'avatar utilisateur
                        upload.download(`https://eu.ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`, `./public/users/${newUser.id}/user_${newUser.id}_default_avatar.png`, (err) => {
                            if(err) {
                                return console.error(err);
                            }
                            newUser.update({
                                profilePicture: `${process.env.BASE_URL}/users/${newUser.id}/user_${newUser.id}_default_avatar.png`
                            })
                            .then(() => {
                                console.log(`Utilisateur ${newUser.id} : Enregistrement avatar effectué`)
                            })
                            .catch(error => {
                                return console.error(error);
                            })
                        })
            
                        if(error) {
                            return console.error(error);
                        }
                    })

                    // Inscription finalisée
                    const message = `Merci de votre inscription ${firstName}, celle-ci a été enregistrée avec succès.`
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
                const message = `Une erreur s'est produite, l'inscription n'a pas pu aboutir.`
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
    const email = req.body.email

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
            emailToken : token.mail(email)
        })
        .then(() => {
            // Mail de confirmation
        const firstName     = user.firstName
        const createdAt     = moment(user.createdAt).format('LLLL')
        const emailToken    = user.emailToken

        mailer.registerActivationMail(email, firstName, createdAt, emailToken)
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
            return res.status(502).json({ message, error: error })
        })
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
        return res.status(502).json({ message, data: error })
    })
}

/**------------------------------------
 * Confirmation d'inscription
--------------------------------------*/
exports.userEmailConfirmation = (req, res, next) => {
    const email         = req.params.email
    const emailToken    = req.params.emailToken
    const expired       = token.mailIsExpire(emailToken)
    
    // Vérification en bdd de l'utilisateur (via son email)
    User.findOne({
        where: { email: email }
    })
    .then(user => {
        if (!user) {
            const activation = false
            const error = true
            const message = `Une erreur s'est produite, impossible de vérifier le statut utilisateur.`
            res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
            
        } else if (user.emailVerified == true) {
            const activation = true
            const error = true
            const message = `Ce compte utilisateur est déjà confirmé. Profiter de nos services en vous authentifiant.`
            res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
            
        } else if (user.emailToken !== emailToken) {
            const activation = false
            const error = true
            const message = `Une erreur s'est produite, impossible de vérifier le statut de confirmation.`
            res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
            
        } else if (expired == true) {
            const activation = false
            const error = true
            const message = `Une erreur s'est produite, le délai de confirmation d'inscription a expiré.`
            res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
        } else {
            user.update({
                emailVerified: true,
            })
            .then(() => {
                const activation = true
                const error = false
                const message = `L'activation de votre compte a aboutie avec succes.`
                res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
            })
            .catch(err => {
                const activation = false
                const error = true
                const message = `Une erreur s'est produite, impossible de confirmer l'état d'activation du compte.`
                res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
            })
        }
    })
        .catch(err => {
            const activation = false
            const error = true
            const message = `Une erreur s'est produite, impossible de confirmer l'activation du compte.`
            res.redirect(`${process.env.ALLOWED_ORIGINS}/register/confirmation/error=${error}&activation=${activation}/${user.email}/${user.emailToken}&message=${message}`)
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
            const message = `Une erreur s'est produite, l'authentification a échoué.`
            return res.status(401).json({ message })
        } else {
            bcrypt.compare(password, user.password)
            .then(valid => {
                if(valid) {
                    // Vérification de la confirmation d'enregistrement
                    if(user.emailVerified == false) {
                        throw new Error()
                    }

                    user.update({
                        lastLogin   : user.loggedIn,
                        loggedIn    : new Date(),
                    })
                    .then(() => {
                        return res.status(200).json({
                            'Status'            : "Logged in !",
                            'User'              : user,
                            'Token'             : token.generate(user),
                        })
                    })
                    .catch(error => {
                        const message = `Une erreur s'est produite, impossible de s'authentifier.`
                        return res.status(409).json({ message, error: error })
                    })
                } else {
                    const message = `Une erreur s'est produite, l'authentification a échoué.`
                    return res.status(401).json({ message })
                }
            })
            .catch(error => {
                if(error.name == 'Error') {
                    const message = `Votre adresse mail n'a pas été vérifiée. Merci de consulter vos emails ou de demander l'envoi d'un nouveau mail de confirmation.`
                    return res.status(409).json({ message })
                }
                const message = `Une erreur s'est produite, impossible de vérifier l'authentification.`
                return res.status(409).json({ message, error: error })
            })
        }
    })
    .catch(error => {
        const message = `Une erreur s'est produite, impossible de permettre l'authentification.`
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