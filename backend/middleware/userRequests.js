// Imports
const { body, validationResult } = require('express-validator');

// Règles de validation pour le mail
exports.mailValidationRules = () => {
    return [
        body('email')
            .notEmpty().withMessage(`L'email est une propriété requise, il ne peut pas être vide.`)
            .isEmail().withMessage(`L'adresse email saisie, n'est pas une adresse mail valide.`),
    ]
};

// Règles de validation pour le mot de passe
exports.pwdValidationRules = () => {
    return [
        body('password')
            .notEmpty().withMessage(`Le mot de passe est une propriété requise, il ne peut pas être vide.`)
            .isStrongPassword().withMessage(`Votre mot de passe semble simple : vous pouvez l'améliorer en ajoutant des lettres majuscules, minuscules, des chiffres ou des symboles supplémentaires.`),
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