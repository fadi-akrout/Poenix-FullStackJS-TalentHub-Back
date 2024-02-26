const express = require('express')

const { loginUser, signupUser, refresh } = require( '../controllers/userController' )
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
//router.post('/logout', logout )





module.exports= router