const User           = require("../model/userModel");
const Course         = require("../model/courseModel");
const AppError       = require("../errors/appError");
const catchAsync     = require("../utils/catchAsync");
const handlerFactory = require("../utils/handlerFactory");
const { cloudUpload } = require("..//utils/cloudinary");
const upload = require("../utils/multer");
const courseModel = require("../model/courseModel");

const course = {};

//create a course
course.create = catchAsync(async (req, res, next) => {
  const {
    course,
    introduction,
    game,
    description,
    course_review,
    game_review,
  } = req.body;

  const courseExist = await Course.exists({ course });
  if (courseExist) return next(new AppError("Course already Exists", 400));

  //change id to MOB-N
  let courseId;

  const lastCourse = await Course.find().sort({ _id: -1 }).limit(1);

  if (lastCourse.length == 0) {
    courseId = "MOB-1";
  } else {
    courseId = "MOB-" + `${Number(lastCourse[0].courseId.split("-")[1]) + 1}`;
  }

  //save new Course
  const new_course = await new Course({
    courseId,
    course,
    introduction,
    game,
    description,
    course_review,
    game_review,
  }).save();

  if (!new_course) return next(new AppError("Could Not Creat Course!", 403));

  //send a response
  res.status(201).send({
    message: "Course Created Successfully!",
  });
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
course.getOneCourse = catchAsync(async (req, res, next) => {
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

course.enrollCourse = catchAsync(async (req, res, next) => {
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

//multer
course.uploadImage = upload.array("video", 5);

// upload content
course.uploadContent = catchAsync(async (req, res, next) => {
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
  //const new_course = await new Course({}).save();

  //if (!new_course) return next(new AppError("Could Not Upload Content", 403));

  //send a response
  // res.status(200).send({
  //   message: "Content Uploaded Successfully!",
  //});
});

module.exports = course;
