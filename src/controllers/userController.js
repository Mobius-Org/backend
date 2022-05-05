const User = require("../model/userModel");
const Notif = require("../model/notificationModel");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");

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


// subscribe to newsletter
userController.subscribe = catchAsync( async (req, res, next) => {
    // get email
    const { email } = req.body;
    if (!email) return next(new AppError("No Email To Subscribe", 400));

    const newsletter = new Notif();
    newsletter.subscribe(email);

    newsletter.save((err, _) => {
        if (err) return next(new AppError("There is an error, we will fix it soon", 400));
        res.status(201).send({
            status: "success",
            message: "Newsletter Subscription Successful!"
        })
    })

})
module.exports = userController;