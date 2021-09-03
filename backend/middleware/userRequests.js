// Modules requis
const { body, validationResult } = require('express-validator');

// Règles de validation pour l'inscription
exports.registerValidationRules = () => {
    return [
        body('firstname')
            .notEmpty().withMessage(`Le prénom est une propriété requise, il ne peut pas être vide.`)
            .isLength({ min: 3, max: 40 }).withMessage(`Le prénom doit contenir entre 3 et 40 caractères.`)
            .custom((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i.test(val)).withMessage(`Le prénom ne peut contenir que des lettres, des espaces et des traits d'union.`),
        body('lastname')
            .notEmpty().withMessage(`Le nom est une propriété requise, il ne peut pas être vide.`)
            .isLength({ min: 3, max: 40 }).withMessage(`Le nom doit contenir entre 3 et 40 caractères.`)
            .custom((val) => /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i.test(val)).withMessage(`Le nom ne peut contenir que des lettres, des espaces et des traits d'union.`),
        body('email')
            .notEmpty().withMessage(`L'email est une propriété requise, il ne peut pas être vide.`)
            .isEmail().withMessage(`L'adresse email saisie, n'est pas une adresse valide. Merci de saisir une adresse mail valide.`),
        body('password')
            .notEmpty().withMessage(`Le mot de passe est une propriété requise, il ne peut pas être vide.`)
            .isLength({ max: 32 }).withMessage(`Le mot de passe ne peut pas excéder 32 caractères.`)
            .isStrongPassword().withMessage(`Votre mot de passe doit être fort. Il doit contenir au minimum 8 caractères dont 1 majuscule minimum, 1 symbole minimum et 1 chiffre minimum.`),
        body('pwdConfirm')
            .notEmpty().withMessage(`La confirmation du mot de passe est une propriété requise, il ne peut pas être vide.`)
            .custom((value, { req }) => value === req.body.password).withMessage(`Le mot de passe de confirmation ne correspond pas. Merci de saisir à l'identique votre mot de passe.`),
    ]
};

// Règles de validation pour la connexion
exports.loginValidationRules = () => {
    return [
        body('email')
            .notEmpty().withMessage(`L'email est une propriété requise, il ne peut pas être vide.`)
            .isEmail().withMessage(`L'adresse email saisie, n'est pas une adresse valide. Merci de saisir une adresse mail valide.`),
        body('password')
            .notEmpty().withMessage(`Le mot de passe est une propriété requise, il ne peut pas être vide.`)
            .isStrongPassword().withMessage(`Votre mot de passe doit être fort. Il doit contenir au minimum 8 caractères dont 1 majuscule minimum, 1 symbole minimum et 1 chiffre minimum.`),
    ]
};

// Règles de validation pour le mail
exports.mailValidationRules = () => {
    return [
        body('email')
            .notEmpty().withMessage(`L'email est une propriété requise, il ne peut pas être vide.`)
            .isEmail().withMessage(`L'adresse email saisie, n'est pas une adresse valide. Merci de saisir une adresse mail valide.`),
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