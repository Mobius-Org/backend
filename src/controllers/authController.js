const jwt                  = require('../services/jwt');
const User                 = require('../model/userModel');
const AppError             = require('../errors/appError');
const catchAsync           = require('../utils/catchAsync');
const { validationResult } = require('express-validator');
const handlerFactory       = require('../utils/handlerFactory');

const userAuth = {};
const exclude = {
    lastLoginTime: 0,
    lastLogoutTime: 0,
    passwordChangedTime: 0
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
    res.status(201).send({
        status: "success",
        message: "User Created Successfully!"
    });
});


// Login
userAuth.login = catchAsync(async (req, res, next) => {
    // get email and password from form
    const { email, password } = req.body;

    // if email/username or password is absent return error
    if (!email || !password) return next(new AppError("Please Provide Email And Password!", 400));

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

module.exports = userAuth;