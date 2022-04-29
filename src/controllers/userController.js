const User = require("../model/userModel");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");

const userController = {};

// update user progress
userController.updateProgress = catchAsync( async (req, res, next) =>{
    const { title, courseId } = req.body;
    // get user
    const user = await User.findById(req.USER_ID);
    // update progress
    user.updateProgress(courseId, title);
    // save user
    user.save((err, _) => {
        if (err) return next(new AppError("Could Not Update Progress", 400));
        res.status(200).send({
            status: "success",
            message: "Updated Course Progress"
        });
    });
});

module.exports = userController;