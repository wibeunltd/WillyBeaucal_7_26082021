// Imports
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
    async registerActivationMail(email, firstName, createdAt, emailToken) {
        const activationLink = `${process.env.BASE_URL}/api/users/account/confirmation/${email}/${emailToken}`;

        const msg = await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject:"Moments ● Merci de confirmer votre adresse email",
            html:
            `<style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap);body{font-size:12px;}h1{font-size:16px}.button{background-color:#4caf50;border:none;border-radius:20px;color:#fff;padding:15px 32px;text-align:center;text-decoration:none;display:inline-block}.info{font-size:9px}</style><h1>Hello ${firstName},</h1><p>Nous sommes heureux, que vous vous soyez inscrit à <strong>Moments</strong>. Complétez votre inscription en cliquant sur le bouton ci-dessous. Ce lien vérifiera votre adresse e-mail, puis vous ferez officiellement partie de la communauté.</p><a class="button" href="${activationLink}" target="_blank">Vérifier votre email</a><p></p><p>Si vous rencontrez des problèmes avec le bouton de vérification, veuillez coller l'URL suivante dans votre navigateur Web :</p><p>${activationLink}</p><p>Bien cordialement, l'équipe Moments</p><p class="info">Ceci est un mail automatique, suite à votre inscription du ${createdAt}, merci de ne pas y répondre. Si vous n'êtes pas à l'origine de cette demande d'inscription, merci d'ignorer ce mail. <strong>Le lien de vérification expire dans ${process.env.MAIL_TOKEN_LIFE}.</strong></p>`
        });
        
        console.log("Mail envoyé: %s", msg.messageId, 'Lien de prévisualisation du mail: %s', nodemailer.getTestMessageUrl(msg))
    }
}