// Modules requis
const router  = require('express').Router();

// Controller user
const userCtrl = require('../controllers/userCtrl');

// Règles de validations
const { registerValidationRules, loginValidationRules, mailValidationRules, errorsReturn } = require('../middleware/userRequests');

//Routes users
router.post('/register', registerValidationRules(), errorsReturn, userCtrl.register)
router.get('/activation/:email/:registerId', userCtrl.confirmUserRegistration)
router.get('/activation/sendingMailFailed', mailValidationRules(), errorsReturn, userCtrl.resendConfirmationMail)
router.post('/login', loginValidationRules(), errorsReturn, userCtrl.login)

module.exports = router