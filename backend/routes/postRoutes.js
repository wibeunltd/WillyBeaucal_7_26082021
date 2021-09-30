// Imports
const router    = require('express').Router()
const token     = require('../utils/token')

// Controller post
const postCtrl = require('../controllers/postCtrl')

//Routes posts
router.post('/new', token.checkUserAuthenticity, postCtrl.create)
//router.get('/all', token.isLoggedIn, postCtrl.all)

module.exports = router