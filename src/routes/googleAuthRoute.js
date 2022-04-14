const router           = require('express').Router();
const authController   = require('../controllers/authController');
const googleController = require('../controllers/googleController');

router.get(
    '/',
    googleController.googleAuth
);

router.get(
    '/auth/callback', 
    googleController.getAuthCode,
    authController.login
);

module.exports = router;