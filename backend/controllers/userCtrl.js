// Module requis
const bcrypt        = require('bcrypt')
const fs            = require('fs')
const { User }      = require('../models')
const dateFormat    = require('dateformat')
const mailer        = require('../utils/mailer')

// Variable d'environnement
require('dotenv').config

/**------------------------------------
 * Inscription d'un nouvel utilisateur
--------------------------------------*/
exports.register = (req, res, next) => {
    // Champs requête
    const { firstname, lastname, email, password } = req.body

    // Vérification en bd de la présence de l'utilisateur (via son email)
    User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    .then(user => {
        // Gestion administrateur
        const role = (email == 'hello@groupomania.fr') ? true : false

        // Utilisateur présent en bd
        if(user) {
            const message = `L'adresse email saisie ne peut pas être utilisée. Merci d'en choisir une autre.`
            return res.status(409).json({ message })
        }
        
        // Email disponible
        else {
            bcrypt.hash(password, 12)
            .then(hash => {
                // Création de l'utilisateur
                User.create({
                    firstname       : firstname,
                    lastname        : lastname,
                    email           : email,
                    password        : hash,
                    coverPicture    : `https://picsum.photos/1000/500`,
                    profilePicture  : `https://eu.ui-avatars.com/api/?background=random&name=${firstname}+${lastname}`,
                    isAdmin         : role,
                    lastLogin       : dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
                })
                .then(newUser => {
                    // Gestion de l'id d'enregistrement
                    User.findOne({
                        where: { id: newUser.id}
                    })
                    .then(user => {
                        user.update({
                            registerId: (newUser.id).toString()
                        })
                        .then(() => {
                            // Mail de confirmation
                            const userId        = newUser.id
                            const createdAt     = dateFormat(newUser.createdAt, "dd-mm-yyyy HH:MM:ss")
                            const registerId    = newUser.id

                            mailer.registerActivationMail(email, userId, firstname, createdAt, registerId)
                            .then(() => {
                                // Dossier utilisateur
                                fs.mkdir((`./public/users/${newUser.id}`), {recursive:true}, error =>{
                                    if(error) {
                                        return console.error(error);
                                    }
                                })

                                // Inscription finalisée
                                const message = `L'inscription de l'utilisateur ${firstname} ${lastname} a aboutie avec succès.`
                                return res.status(201).json({ message })

                            })
                            .catch(error => {
                                const message = `Un problème serveur, ne permet pas l'envoi du mail de confirmation. Merci de réessayer ultérieurement.`
                                return res.status(500).json({ message, data: error })
                            })
                        })
                        .catch(error => {
                            const message = `Un problème serveur, ne permet pas la bonne démarche de l'inscription. Merci de réessayer ultérieurement.`
                            return res.status(500).json({ message, data: error })
                        })
                    })
                    .catch(error => {
                        const message = `Un problème serveur, ne permet pas la mise à jour de l'id d'enregistrement'. Merci de réessayer ultérieurement.`
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