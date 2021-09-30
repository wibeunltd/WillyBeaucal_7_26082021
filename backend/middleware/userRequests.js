// Imports
const { body, validationResult } = require('express-validator');

// Règles de validation pour le mail
exports.mailValidationRules = () => {
    return [
        body('email')
            .notEmpty().withMessage(`L'email est une propriété requise, il ne peut pas être vide.`)
            .isEmail().withMessage(`L'adresse email saisie, n'est pas une adresse valide. Merci de saisir une adresse mail valide.`),
    ]
};

// Règles de validation pour le mot de passe
exports.pwdValidationRules = () => {
    return [
        body('password')
            .notEmpty().withMessage(`Le mot de passe est une propriété requise, il ne peut pas être vide.`)
            .isStrongPassword().withMessage(`Votre mot de passe doit être fort. Il doit contenir au minimum 8 caractères dont 1 majuscule minimum, 1 symbole minimum et 1 chiffre minimum.`),
    ]
};

// Retour erreurs des règles de validation
exports.errorsReturn = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            rulesValidationErrors: errors.array()
        });
    } else {
        return next();
    }
};