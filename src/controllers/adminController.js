const fs = require("fs");
const upload = require("../middlewares/multer");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");
const StudentContent = require("../model/studentContentModel");

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
