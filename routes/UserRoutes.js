/* const express = require('express')

const { loginUser, signupUser,refresh,logout } = require( '../controllers/userController' )
const loginLimiter = require('../middleware/loginLimiter')

const router = express.Router()
// login
// how to use the loginLimiter in this file?
router.post('/login', loginLimiter,loginUser)

// sign up
router.post('/signup', signupUser)
// refresh
router.get('/refresh', refresh)
//logout
router.post('/logout', logout)





module.exports= router */


const express = require('express')
const router = express.Router()
const authController = require('../controllers/userController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

// sign up
router.post('/signup', authController.signupUser)

module.exports = router