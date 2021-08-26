// Modules requis
const router   = require('express').Router()

// Controller initialisation
const mainCtrl = require('../controllers/mainCtrl')

// Route initialisation
router.get('/', mainCtrl.init)

module.exports = router