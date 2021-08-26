// Variable d'environnement
require('dotenv').config()

exports.init = (req, res) => {
    res.json(`Backend du réseau social Moments de GROUPOMANIA. Make with ❤ by ${process.env.OWNER} !`)
}