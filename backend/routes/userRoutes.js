// Modules requis
const router  = require('express').Router();
const token   = require('../utils/token')

// Controller user
const userCtrl = require('../controllers/userCtrl');

// Règles de validations
const { registerValidationRules, loginValidationRules, mailValidationRules, errorsReturn } = require('../middleware/userRequests');

//Routes users
router.post('/register', registerValidationRules(), errorsReturn, userCtrl.register)
router.get('/activation/:email/:registerId', userCtrl.confirmUserRegistration)
router.get('/activation/sendingMailFailed', mailValidationRules(), errorsReturn, userCtrl.resendConfirmationMail)
router.post('/login', loginValidationRules(), errorsReturn, userCtrl.login)
router.get('/profile', token.isLoggedIn, userCtrl.profile)
router.put('/profile', token.isLoggedIn, userCtrl.profileUpdate)

module.exports = router