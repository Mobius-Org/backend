const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// create user
router.post(
    '/signUp',
    // Validation
    body('email').isEmail(),
    body('name').isString(),
    body('age').isNumeric(),
    body('favColor').isString(),
    body('password').isLength({ min: 6}).matches(/\d/),
    authController.signup
);

// login
router.post(
    '/login',
    authController.login
);

// forgot password
router.patch(
    '/forgot-password',
    authController.forgotPassword
);

// reset password
router.patch(
    '/reset-password',
    authController.resetPassword
);


module.exports = router;