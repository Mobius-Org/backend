const fs = require("fs");
const upload = require("../middlewares/multer");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");
const StudentContent = require("../model/studentContentModel");
const User = require("../model/userModel")

const adminController = {};

//approve student content
adminController.approveContent = catchAsync(async (req, res, next) => {
  const status = "approved";
  //find content thru _id
  const contentId = req.params.id;

  let studentContent = await StudentContent.findOne({ contentId });
  if (!studentContent)
    return next(new AppError("Student Content not found", 404));

  studentContent.updateStatus(status);
  studentContent.save((err, _) => {
    if (err) {
      return next(
        new AppError("Could not change status, Something Went Wrong", 400)
      );
    }

    //send mail
    const user = User.findById({_id: studentContent.uploader})
    let body = {
        data: {
            courseName: studentContent.courseTitle,
        },
        recipient: user.email,
        subject: `Congratulations on finishing ${studentContent.courseTitle}`,
        type: "pwd_reset",
        attachments: [{
            filename:"mobius-logo.png",
            path:"https://res.cloudinary.com/mobius-kids-org/image/upload/v1651507811/email%20attachments/mobius-logo.png",
            cid:"mobius-logo"
        },{
            filename:"child-jumping.gif",
            path:"https://res.cloudinary.com/mobius-kids-org/image/upload/v1651825445/email%20attachments/child-jumping.gif",
            cid:"child-jumping"
        }]
    };

    let mailer = new emailService();
    mailer.courseComplete(body);

    //send a response
    res.status(200).send({
      status: "status",
      message: `This student content has been accepted`,
    });
  });
});

//reject student content
adminController.rejectContent = catchAsync(async (req, res, next) => {
  const status = "rejected";
  //find content thru _id
  const contentId = req.params.id;

  let studentContent = await StudentContent.findOne({ contentId });
  if (!studentContent)
    return next(new AppError("Student Content not found", 404));

  studentContent.updateStatus(status);
  studentContent.save((err, _) => {
    if (err) {
      return next(
        new AppError("Could not change status, Something Went Wrong", 400)
      );
    }
    //send a response
    res.status(200).send({
      status: "status",
      message: `This student content has been rejected`,
    });
  });
});

//see all uploaded contents
adminController.getAllUploadedContent = catchAsync(async (req, res, next) => {
  const contents = await StudentContent.find({});
  if (!contents) {
    return next(new AppError(`Could not GET all uploaded contents`, 404));
  }

  //send a response
  res.status(200).send({
    status: "status",
    data: contents,
  });
});

//get a course by id
adminController.getOneUploadedContent = catchAsync(async (req, res, next) => {
  //find content thru _id
  const contentId = req.params.id;
  //console.log(_id);

  let studentContent = await StudentContent.findOne({ contentId });
  if (!studentContent)
    return next(new AppError("Student Content not found", 404));

  //send response
  res.status(200).send({
    status: "success",
    studentContent,
  });
});

module.exports = adminController;