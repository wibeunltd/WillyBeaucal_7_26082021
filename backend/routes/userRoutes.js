// Modules requis
const router  = require('express').Router();

// Controller user
const userCtrl = require('../controllers/userCtrl');

// Règles de validations
const { registerValidationRules, loginValidationRules, errorsReturn } = require('../middleware/userRequests');

//Routes users
router.post('/register', registerValidationRules(), errorsReturn, userCtrl.register)

module.exports = router