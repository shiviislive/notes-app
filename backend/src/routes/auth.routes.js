const express = require('express');
const router = express.Router();
const { userRegisterController, userLoginController, userLogoutController } = require('../controllers/auth.controllers');



router.post('/register', userRegisterController)
router.post('/login', userLoginController)

router.post('/logout', userLogoutController)

module.exports = router;