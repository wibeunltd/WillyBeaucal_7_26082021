// Module requis
const express   = require('express')
const morgan    = require('morgan')
const helmet    = require('helmet')
const csp       = require('helmet-csp')
const cors      = require('cors')
const path      = require('path')
const favicon   = require('serve-favicon')

// Variables d'environnement
require('dotenv').config()

// Instanciation de l'application
const app = express()

app
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(morgan('dev'))
.use(helmet())
.use(csp({ useDefaults: true }))
.use(cors())
.use(express.static(path.join(__dirname, '/public/')))
.use(favicon(path.join(__dirname, '/public/images/favicon.png')))
.use('/', require('./routes/mainRoutes'))

// Requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

//Erreurs 404
app.use(({ res }) => {
    const message = `Désolé, la ressource demandée n'est plus disponible à cette adresse, où n'existe plus. Merci de revenir à la page d'accueil.`
    res.status(404).json({ message })
  })

module.exports = app