const nodemailer = require("nodemailer")
const crypto = require('crypto')
exports.generateOTP= () => {
    let otp = ''
    for(let i = 0; i<=3; i++){
        const randVal = Math.round(Math.random()* 9)
        otp = otp +randVal
    }
    return otp;
} 

exports.mailTransport= ()=>
    
        nodemailer.createTransport({
            service:"Gmail",
            auth: {
                user:'amir.laroussi@esprit.tn', // replace with your email
                pass: 'lanm vdzd wsil poml'// replace with your password
            }
        });

exports.createRandomBytes= () =>
new Promise( (resolve,reject)=>{
    crypto.randomBytes(30, (err, buffer) =>{
        if(!err){
            resolve(buffer.toString('hex'));
        }else{
            reject(err);
        }
    })
})
exports.generatePasswordResetTemplate = (url) => {
    return `
    <!DOCTYPE html>
    <html lang="en"> 
    <head>
       <meta charset="utf-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <style>
       @media only screen and (max-width: 620px) {
        h1 {
            font-weight: normal;
            font-size: 25px;
            padding: 5px;
        }
       }
       </style>
       <style>
       html, body {
         height: 100%;
         margin: 0;
         padding: 0;
         display: flex;
         align-items: center;
         justify-content: center;
       }
       </style>
    </head>
    <body style="background-image: url('https://esprittncom-my.sharepoint.com/:i:/r/personal/amir_laroussi_esprit_tn/Documents/vecteezy_vector-abstract-background-with-soft-gradient-color-and_6849053.jpg'); background-repeat: no-repeat; background-size: cover;">
      <div style="text-align: center;">
        <img src="https://esprittncom-my.sharepoint.com/:i:/r/personal/amir_laroussi_esprit_tn/Documents/talenthublogo.png" alt="TalentHub Logo" style="width: 200px; height: auto;">
        <h1 style="color: #333;">Reset Password</h1>
        <p style="font-size: 18px;">Hello,</p>
        <p style="font-size: 18px;">You are receiving this email because a password reset request was initiated for your account.</p>
        <p style="font-size: 18px;">Please click the link below to reset your password:</p>
        <p style="font-size: 18px;"><a href="${url}">Reset Password</a></p>
        <p style="font-size: 18px;">If you did not request a password reset, please ignore this email.</p>
        <br>
        <p style="font-size: 18px;">Talent Hub</p>
        <p style="font-size: 16px;">Address: Esprit</p>
        <p style="font-size: 16px;">Email: TalentHub@esprit.tn</p>
        <p style="font-size: 16px;">Phone: +0123 4567 8910</p>
      </div>
    </body>
    </html>`
}

exports.plainEmailTemplate=(username,heading,message)=>{
    return `
    <!DOCTYPE html>
    <html lang="en"> 
    <head>
       <meta charset="utf-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <style>
       @media only screen and (max-width: 620px) {
        h1 {
            font-weight: normal;
            font-size: 25px;
            padding: 5px;
        }
       }
       </style>
       <style>
       html, body {
         height: 100%;
         margin: 0;
         padding: 0;
         display: flex;
         align-items: center;
         justify-content: center;
       }
       </style>
    </head>
    <body style="background-image: url('https://esprittncom-my.sharepoint.com/:i:/r/personal/amir_laroussi_esprit_tn/Documents/vecteezy_vector-abstract-background-with-soft-gradient-color-and_6849053.jpg'); background-repeat: no-repeat; background-size: cover;">
      <div style="text-align: center;">
        <img src="https://esprittncom-my.sharepoint.com/:i:/r/personal/amir_laroussi_esprit_tn/Documents/talenthublogo.png" alt="TalentHub Logo" style="width: 200px; height: auto;">
        <h1 style="color: #333;">Password Reset Successfully</h1>
        <p style="font-size: 18px;">Hello ${username},</p>
        <p style="font-size: 18px;">${heading}</p>
        <p style="font-size: 18px;">${message}</p>
        <br>
        <p style="font-size: 18px;">Talent Hub</p>
        <p style="font-size: 16px;">Address: Esprit</p>
        <p style="font-size: 16px;">Email: TalentHub@esprit.tn</p>
        <p style="font-size: 16px;">Phone: +0123 4567 8910</p>
      </div>
    </body>
    </html>`
}

exports.verifyEmail= async (otp, userId)=>{
    try{
        const {data} = await client.post('auth/verify-email', {otp, userId});
        return data;
    }catch(error){
        return catchError(error);
    }
}
     
