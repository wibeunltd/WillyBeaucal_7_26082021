// Variable d'environnement
require('dotenv').config()

exports.init = (req, res) => {
    res.json(`Backend du réseau social Moments from GROUPOMANIA. Make with ❤ by ${process.env.OWNER} !`)
}