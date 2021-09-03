// Module requis
const jwt = require('jsonwebtoken')

// Variables d'environnement
require('dotenv').config

module.exports =  {
    mail: (email) => {
        return jwt.sign({ mail: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h'})
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
        const accessToken = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN, { expiresIn: '1m'})
        const refreshToken = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN, { expiresIn: '5d'})
        return ({ accessToken, refreshToken })
    },
    authenticate: (req, res, next) => {
        const authHeader = req.headers['authorization']

        
    }
}