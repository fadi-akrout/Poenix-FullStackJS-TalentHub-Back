const nodemailer = require("nodemailer")
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

     
