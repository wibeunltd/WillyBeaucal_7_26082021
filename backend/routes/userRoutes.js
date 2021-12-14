// Imports
const router  = require('express').Router();
const token   = require('../utils/token')

// Controller user
const userCtrl = require('../controllers/userCtrl');

// Règles de validations
const { mailValidationRules, pwdValidationRules, errorsReturn } = require('../middleware/userRequests');

//Routes users
router.post('/register', userCtrl.register)
router.get('/account/confirmation/:email/:emailToken', userCtrl.userEmailConfirmation)
router.post('/activation/sendingMailFailed', mailValidationRules(), errorsReturn, userCtrl.resendConfirmationMail)
router.post('/login', mailValidationRules(), errorsReturn, userCtrl.login)
router.get('/profile', token.checkUserAuthenticity, userCtrl.profile)
router.put('/profile', token.checkUserAuthenticity, userCtrl.profileUpdate)

module.exports = router