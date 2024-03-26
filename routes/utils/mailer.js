const nodemailer = require('nodemailer');

// Fonction d'envoi d'email
async function sendResetPasswordEmail(email, link) {
    let transporter = nodemailer.createTransport({
        // Exemple avec Gmail; pour d'autres services, consultez la documentation de Nodemailer
        service: 'gmail',
        auth: {
            user: 'Cookiza02@gmail.com',
            pass: 'Cookiza.2002',
        },
    });

    let mailOptions = {
        from: 'Cookiza02@gmail.com',
        to: email,
        subject: 'Réinitialisation du mot de passe',
        html: `Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${link}">${link}</a>`, // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Email envoyé : ' + info.response);
    });
}