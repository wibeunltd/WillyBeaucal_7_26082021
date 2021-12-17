// Variable d'environnement
require('dotenv').config()

exports.init = (req, res) => {
    res.json(`Backend du réseau social Moments from GROUPOMANIA. Made with ❤ by ${process.env.OWNER} !`)
}