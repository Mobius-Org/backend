const jwt                  = require('../services/jwt');
const User                 = require('../model/userModel');
const AppError             = require('../errors/appError');
const catchAsync           = require('../utils/catchAsync');
const { validationResult } = require('express-validator');
const { emailService }     = require('../utils/emailer');

const userAuth = {};
const exclude = {
    lastLoginTime: 0,
    lastLogoutTime: 0,
    passwordChangedTime: 0,
};


// User Sign Up
userAuth.signup = catchAsync(async (req, res, next) => {
    const { name, age, favColor, email, password } = req.body;
    
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        if (errors.array().includes('email')) return next(new AppError("Invalid Email!", 400));
        if (errors.array().includes('age')) return next(new AppError("Please Select A Valid Age!", 400));
        if (errors.array().includes('name')) return next(new AppError("Please Input Your Full Name!", 400));
        if (errors.array().includes('favColor')) return next(new AppError("Please Select A Favorite Color!", 400));
        if (errors.array().includes('password')) return next(new AppError("Password Must Be At Least 6 Characters And Must Contain A Number", 400));
    }

    const userExist = await User.exists({ email });
    if (userExist) return next(new AppError("User With Email Already Exists!", 400));

    // create user
    const user = new User();
    // set password
    user.setPassword(password);
    // set details
    user.set({ name, age, email, favColor });
    await user.save();

    if (!user) return next( new AppError("Could Not Creat User!", 403));
    
    // send response
    jwt.createSendToken(user, 201, res);
});

// Login
userAuth.login = catchAsync(async (req, res, next) => {
    // get email and password from form
    const { email, password } = req.body;

    // if email/username or password is absent return error
    if (!email || !password)
    return next(new AppError("Please Provide Email And Password!", 400));
    // find user with email
    let user = await User.findOne({ email }).select(exclude);
    if (!user) return next(new AppError(`User With Email: ${email}, Not Registered. Create Account Instead!`, 404));

    // validate user
    if (user.isValidPassword(password)){
        user.lastLoginTime = new Date();
        user.lastLogoutTime = null;
        await user.save();
        jwt.createSendToken(user, 200, res);
    } else return next(new AppError("Invalid Email Or Password!", 403));
});


// Forgot Password
userAuth.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return next(new AppError(`User With Email: ${email}, Is Not Registered!`, 404));
    else {
        // generate reset token
        const resetToken = user.genResetToken();
        user.resetToken = resetToken;
        await user.save();
        // generate one time valid for 20 minutes link
        const link = `${req.get('origin')}/reset-password/${user.resetToken}`;

        // send mail
        let body = {
            data: {
                link,
                name: user.name,
                title: "RESET PASSWORD"
            },
            recipient: user.email,
            subject: "PASSWORD RESET",
            type: "pwd_reset"
        };

        let mailer = new emailService(),
            response = await mailer.reset(body);

        // send response
        res.status(200).send({
            status: "success",
            message: "Password Reset Successful! Please Check Your Email For A Link To Change Your Password!"
        });
    }
});


// Change Password
userAuth.resetPassword = catchAsync(async (req, res, next) => {
    const resetToken = req.params.token;

    // find user with token
    let user = await User.findOne({ resetToken });
    if (!user) return next(new AppError("Cannot Find User With Initial Password Reset Request!", 400));

    let data = jwt.decodeResetToken(resetToken, user.password.hash),
        newPassword = req.body.password;

    if (!data) return next(new AppError("Link Expired Or Has Already Been Used! Initiate Another Request."));

    // change password
    user.setPassword(newPassword);
    user.passwordChangedAt = new Date();
    user.resetToken = "";
    await user.save()
    res.status(200).send({
        status: "success",
        message: "Password Changed Successfully!"
    });
});

module.exports = userAuth;
