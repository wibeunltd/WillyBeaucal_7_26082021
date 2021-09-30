// Imports
const { User, Post } = require('../models')

/**------------------------------------
 * Création d'un post
--------------------------------------*/
exports.create = (req, res, next) => {
    // Champs requête
    const { content } = req.body

    // Vérification en bdd de l'utilisateur (via son id)
    User.findOne({
        where: { id: userId }
    })
    .then(user => {
        if(!user) {
            const message = `L'utilisateur demandé n'a pas été trouvé.`
            return res.status(401).json({ message })
        } else {
            // Création du post
            Post.create({
                UserId      : user.id,
                content     : content,
                attachement : null,
                likes       : 0
            })
            .then(newPost => {
                if(!newPost) {
                    const message = `La publication n'a pas pu aboutir correctement.`
                    return res.status(500).json({ message })
                }
                return res.status(201).json({
                    'Status'    : "Publié !",
                    'User ID'   : user.id,
                    'IsAdmin'   : user.isAdmin,
                    'Post'      : newPost
                })
            })
            .catch(err => {
                const errors = {}
                err.errors.forEach((error) => {
                    errors[error.path] = {
                        value: error.value,
                        errors: error.message
                    }
                })
                const message = `La création de la publication n'a pas pu aboutir correctement.`
                return res.status(500).json({ message, error: errors })
            })
        }
    })
    .catch(error => {
        const message = `Un problème serveur, ne permet pas la verification de l'utilisateur. Merci de réessayer ultérieurement.`
        return res.status(401).json({ message, error: error })
    })
}

/**------------------------------------
 * Récupération de tous les posts
--------------------------------------*/

