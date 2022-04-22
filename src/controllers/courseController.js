const fs              = require("fs");
const User            = require("../model/userModel");
const upload          = require("../utils/multer");
const Course          = require("../model/courseModel");
const AppError        = require("../errors/appError");
const catchAsync      = require("../utils/catchAsync");
const handlerFactory  = require("../utils/handlerFactory");
const { cloudUpload } = require("../utils/cloudinary");

const courseController = {};

//multer
courseController.uploadImage = upload.array("files", 6);

//create a course
courseController.createCourse = catchAsync(async (req, res, next) => {
  let { courseName, introduction, studentCreation, description, game } =
    req.body;

  const courseExist = await Course.exists({ courseName });
  if (courseExist) return next(new AppError("Course already Exists", 400));

  // // Generate a specific id for each course
  let courseId;
  const lastCourse = await Course.find().sort({ _id: -1 }).limit(1);
  if (lastCourse.length == 0) {
    courseId = "MOB-1";
  } else {
    courseId = "MOB-" + `${Number(lastCourse[0].courseId.split("-")[1]) + 1}`;
  }

  // //save new Course
  const newCourse = new Course({
    courseId,
    courseName,
  });

  // add image to course description
  let img;
  if (req.files) {
    const files = req.files,
      path = files[0].path;
    img = await cloudUpload(path);

    if (!img) {
      fs.unlinkSync(path);
      return next(new AppError("Network Error!", 503));
    }
    fs.unlinkSync(path);
  } else return next(new AppError("Image Upload Failed!", 400));

  description = JSON.parse(description);
  description.image = img.url;

  //instance methods
  newCourse.addSections(
    JSON.parse(introduction),
    JSON.parse(game),
    JSON.parse(studentCreation)
  );
  newCourse.addDescription(description);

  //save the schema
  await newCourse.save((err, result) => {
    if (err)
      return next(
        new AppError({ status: "failed", message: err.message }, 400)
      );
    else {
      //send a response
      res.status(200).send({
        message: "Course Created Successfully!",
      });
    }
  });
  if (!newCourse) return next(new AppError("Could Not Create Course!", 403));
});

//create new content
courseController.createContent = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;

  //if a course is not found send an error
  const course = await Course.exists({ courseId });
  if (course) return next(new AppError("Course not found", 404));

  //create content Array
  const contentsArr = [];

  //save new Content
  const newContent = {
    title: title,
    transcript: transcript,
    video: video,
    text: text,
  };
  //instance methods
  course.addContents(contentsArr);

  //save the schema
  await newCourse.save((err, result) => {
    if (err)
      return next(
        new AppError({ status: "failed", message: err.message }, 400)
      );
    else {
      //send a response
      res.status(200).send({
        status: "success",
        message: "Course Created Successfully!",
      });
    }
  });
  if (!newCourse) return next(new AppError("Could Not Create Course!", 403));
});

//see all courses MO B-17
course.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({});
  if (!courses) {
    return next(new AppError(`Could not GET all courses`, 404));
  }

  //send a response
  res.status(200).send({
    status: "status",
    data: courses,
  });
});

//get a course by id
courseController.getOneCourse = catchAsync(async (req, res, next) => {
  //find course thru _id
  const courseId = req.params.id;
  //console.log(_id);

  let course = await courseModel.findOne({ courseId });
  if (!course) return next(new AppError("Course not found", 404));

  //send response
  res.status(200).send({
    status: "success",
    course
  });
});

courseController.enrollCourse = catchAsync(async (req, res, next) => {
  //find course by  id
  const _id = req.params.id;
  //console.log(_id);

  let lesson = await handlerFactory.getById(Course, _id);
  if (!lesson) return next(new AppError("Course not found", 404));

  //find user
  //console.log(req.USER_ID); // => undefined
  let user = await handlerFactory.getById(User, req.USER_ID);
  if (!user) return next(new AppError("User not found", 404));

  //check if course is free
  if (lesson.description.price === 0.0) {
    // change course data by adding a new enrolled student
    lesson.description.student_enrolled.push(req.USER_ID);
    //add course to a students data
    user.enrolledCourse.push({ _id });
    user.save();

    //send response
    res.status(200).send({
      message: `Student successfully enrolled in ${lesson.course}`,
      data: lesson.description.student_enrolled,
    });
  }
});

// upload content
courseController.uploadContent = catchAsync(async (req, res, next) => {
  // find course in question with _id
  // const _id = req.params.id;

  // let lesson = await handlerFactory.getById(Course, _id);
  // if (!lesson) return next(new AppError("Course not found", 404));

  //cloudinary

  if (req.files) {
    const files = req.files;
    files.forEach((path) => cloudUpload(path));
  }

  res.status(200).send({ message: "Course video updated successfully" });

  //const result = await cloudUpload(req.file.path);
  // res.send(result);

  //const {} = req.body;

  //save new content uploaded
  //const newCourse = await new Course({}).save();

  //if (!newCourse) return next(new AppError("Could Not Upload Content", 403));

  //send a response
  // res.status(200).send({
  //   message: "Content Uploaded Successfully!",
  //});
});

module.exports = courseController;
