// Modules requis
const nodemailer = require('nodemailer');

// Variables d'environnement
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    }
})

module.exports = {
    async registerActivationMail(email, userId, firstname, createdAt, registerId) {
        const activationLink = `${process.env.BASE_URL}api/users/verify/${userId}/${registerId}`;

        const msg = await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject:"Merci d'activer votre compte",
            html:
            `<style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap);.button{background-color:#4caf50;border:none;color:#fff;padding:15px 32px;text-align:center;text-decoration:none;display:inline-block;font-size:16px}.info{font-size:10px}</style><center><h3>😀 Hello ${firstname} 😀</h3><p>Vous êtes presque prêt à commencer.</p><p>Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email et profiter de <strong>Moments</strong> avec nous 😎 !</p><a class="button" href="${activationLink}" target="_blank">Vérifier votre email</a><p>Merci,</p><p>L'équipe Moments</p><p class="info">Ceci est un mail automatique, suite à votre inscription du ${createdAt}, merci de ne pas y répondre. Si vous n'avez pas fait de demande d'inscription, merci d'ignorer ce mail.</p></center>`
        });
        
        console.log("Message sent: %s", msg.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(msg))
    }
}