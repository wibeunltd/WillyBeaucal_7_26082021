// Module requis
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
            const message = `Les informations d'authentifications fournies sont invalides.`
            return res.status(401).json({ message })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN, (error, userData) => {
            if(error) {
                if(error.name == "TokenExpiredError"){
                    const message = `Merci de vous reconnecter pour utiliser nos services.`
                    return res.status(401).json({ message, data: error })
                } else {
                    const message = `La vérification de l'utilisateur ne peut pas être effectué.`
                    return res.status(401).json({ message, data: error })
                }
            }
            req.user = userData
            userId = userData.userId
            next()
        })
        } else {
            next()
        }
    },
    isLoggedIn: (req, res, next) => {
        if(req.user) {
            next()
        } else {
            const message = `⛔ Vous n'êtes pas autorisé à acceder à cette ressource.`
            return res.status(401).json({ message })
        }
    }
}