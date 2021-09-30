// Imports
const jwt = require('jsonwebtoken')

// Variables d'environnement
require('dotenv').config

module.exports =  {
    mail: (email) => {
        return jwt.sign({ mail: email }, process.env.ACCESS_TOKEN, { expiresIn: process.env.MAIL_TOKEN_LIFE })
    },
    mailIsExpire: (token) => {
       return jwt.verify(token, process.env.ACCESS_TOKEN, (error) => {
            if(error) {
                return true
            }
            return false
        })
    },
    generate: (user) => {
        const userData = { userId: user.id, isAdmin: user.isAdmin }
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_LIFE })
        return ( accessToken )
    },
    checkUserAuthenticity: (req, res, next) => {
        const authHeader = req.headers['authorization']
        if(authHeader) {
            const token = authHeader.split(' ')[1]
            if(!token) {
                const message = `Une erreur s'est produite, les informations d'authentifications sont invalides.`
                return res.status(401).json({ message })
            }
            jwt.verify(token, process.env.ACCESS_TOKEN, (error, userData) => {
                if(error) {
                    if(error.name == "TokenExpiredError"){
                        const message = `Votre session a expiré. Merci de vous authentifier de nouveau.`
                        return res.status(401).json({ message, error: error })
                    } else {
                        const message = `Une erreur s'est produite, la vérification de l'utilisateur ne peut pas être effectué.`
                        return res.status(401).json({ message, error: error })
                    }
                }
            req.user = userData
            userId = userData.userId
            next()
        })
        } else {
            if (!req.user) {
                const message = `⛔ Vous n'êtes pas autorisé à acceder à cette ressource ⛔`
                return res.status(401).json({ message })
            }
        }
    },
}