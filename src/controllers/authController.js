const jwt                  = require('../services/jwt');
const User                 = require('../model/userModel');
const bcrypt               = require('../services/bcrypt');
const AppError             = require('../errors/appError');
const catchAsync           = require('../utils/catchAsync');
const { validationResult } = require('express-validator');

const userAuth = {};

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

    // hash passwords
    const passwordHash = await bcrypt.hash(password)

    // save user
    const user = await new User({ name, age, favColor, email, password: passwordHash }).save();

    if (!user) return next( new AppError("Could Not Creat User!", 403));
    
    // send response
    res.status(200).send({
        message: "User Created Successfully!"
    });
});

module.exports = userAuth;