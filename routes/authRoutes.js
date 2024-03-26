const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')
const { isResetTokenValid } = require('../middleware/user')

router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

// sign up
router.post('/signup', authController.signupUser)

router.post('/verify-email',authController.verifyEmail)
router.post('/forgot-password',authController.forgotPassword)
router.post('/reset-password',isResetTokenValid,authController.resetPassword)

module.exports = router