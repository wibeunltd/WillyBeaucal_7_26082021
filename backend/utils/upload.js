// Imports
const fs    = require('fs')
const http  = require('http')
const https = require('https')

module.exports = {
    download: (url, dest, e) => {
        // Stream d'écriture du fichier téléchargé
        const file = fs.createWriteStream(dest)

        // Vérification de l'url en http ou https afin d'utiliser le protocole approprié
        const httpMethod = (url.indexOf(('https://')) !== -1) ? https : http

        // Téléchargement
        const request = httpMethod.get(url, (response) => {
            if (response.statusCode !== 200) {
                return e(response.statusCode)
            }

            // Ecriture du fichier téléchargé
            response.pipe(file)

            file.on('finish', () => {
                file.close(e)
            })
        })

        request.on('error', (err) => {
            fs.unlink(dest)
            e(err.message)
        })

        file.on('error', (err)=> {
            fs.unlink(dest)
            e(err.message)
        })
    }
}