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
   <meta http-equiv=”X-UA-Compatible” content=”IE=edge” />
   <style>
   @media only  screen and (max-width:620px) {
    h1{
        font-weight: normal;
        font-size: 25px;
        padding:5px;
    }
   }
   </style>
   </head>
   <body style="margin:0;padding:0;">
     <div>
      <a href="${url}">Reset password </a>
     </div>
   </body>
</html>`
}

exports.plainEmailTemplate=(heading,message)=>{
    return `
    <!DOCTYPE html>
    <html lang="en"> 
    <head>
       <meta charset="utf-8" />
       <meta http-equiv=”X-UA-Compatible” content=”IE=edge” />
       <style>
       @media only  screen and (max-width:620px) {
        h1{
            font-weight: normal;
            font-size: 25px;
            padding:5px;
        }
       }
       </style>
       </head>
       <body style="margin:0;padding:0;">
         <div>
          <h1> ${heading}</h1>
           <p>${message}</p>
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
     
