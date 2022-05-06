const User = require("../model/userModel");
const Notif = require("../model/notificationModel");
const Contents = require("../model/studentContentModel");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");
const { validationResult } = require('express-validator');
const { emailService }     = require('../utils/emailer');

const userController = {};

// update user progress
userController.updateProgress = catchAsync( async (req, res, next) =>{
    const { idx, percent } = req.body,
          courseId = req.params.courseId;
    // get user
    const user = await User.findById(req.USER_ID);
    // update progress
    user.setProgress(courseId, idx, percent);
    // save user
    user.save((err, _) => {
        if (err) return next(new AppError("Could Not Update Progress", 400));
        res.status(200).send({
            status: "success",
            message: "Updated Course Progress"
        });
    });
});

// set game badge and score
userController.setGameRewards = catchAsync( async (req, res, next) => {
    const { score } = req.body;
          courseId = req.params.courseId;
    // get user
    const user = await User.findById(req.USER_ID);
    // set score
    user.setScore(courseId, score);
    // get badge
    user.setGameBadge(courseId);
    // save user
    user.save((err, _) => {
        if (err) return next(new AppError("Could not set game rewards", 400));
        res.status(200).send({
            status: "success",
            message: "You acquired a game badge for this course!"
        });
    });
});

// get my contents
userController.getMyContents = catchAsync( async (req, res, next) => {
    Contents.find({ uploader: req.USER_ID, status: { $gte: "approved" }}, null, function (err, docs) {
        if (err) return next(new AppError("No Contents Found or Not Approved!", 400));
        res.status(200).send({
            status: "success",
            result: docs
        });
    });
});

// get my badges
userController.getMyBadges = catchAsync( async (req, res, next) => {
    const courseId = req.params.courseId;
    const user = await User.findById({ _id: req.USER_ID });
    const myBadges = user.getMyBadges(courseId);
    if (!myBadges) return next(new AppError("Could Not Get Badges!", 400));
    res.status(200).send({
        status: "success",
        result: myBadges
    });
});

// subscribe to newsletter
userController.subscribe = catchAsync( async (req, res, next) => {
    // get email
    const { email } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        if (errors.array()[0].param === "email") return next(new AppError("Invalid Email!", 400));
    }

    const newsletter = new Notif();
    newsletter.subscribe(email);

    newsletter.save((err, _) => {
        if (err) return next(new AppError("There is an error, we will fix it soon", 400));
        //send mail
        let body = {
            data: {
                title: `Welcome to Mobius Newsletter`
            },
            recipient: email,
            subject: `Welcome to Mobius Newsletter`,
            type: "pwd_reset",
            attachments: [{
                filename:"mobius-logo.png",
                path:"https://res.cloudinary.com/mobius-kids-org/image/upload/v1651507811/email%20attachments/mobius-logo.png",
                cid:"mobius-logo"
            },{
                filename:"welcome-blue.gif",
                path:"https://res.cloudinary.com/mobius-kids-org/image/upload/v1651825332/email%20attachments/welcome-blue.gif",
                cid:"welcome-blue"
            }]
        };

        let mailer = new emailService();
        mailer.newsletterSubscribe(body);


        res.status(201).send({
            status: "success",
            message: "Newsletter Subscription Successful!"
        })
    })

})
module.exports = userController;