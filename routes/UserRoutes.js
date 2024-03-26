/* const express = require('express')
const router = express.Router()
const authController = require('../controllers/userController')
const loginLimiter = require('../middleware/loginLimiter')
const crypto = require('crypto'); // Pour générer un token sécurisé
const { sendResetPasswordEmail } = require('./utils/mailer');


router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

// sign up
router.post('/signup', authController.signupUser)

<<<<<<< HEAD
router.post('/forgot-password', authController.forgotPassword);

// Route to reset the password
router.post('/reset-password', authController.resetPassword);




module.exports = router
=======

module.exports = router */

>>>>>>> 1116c86ce88a5c4201971b889287e5c20be6790f
