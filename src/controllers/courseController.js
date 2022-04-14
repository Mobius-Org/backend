const Course = require("../model/courseModel");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("../utils/handlerFactory");
const AppError = require("../errors/appError");

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

  //save new Course
  const new_course = await new Course({
    course,
    introduction,
    game,
    description,
    course_review,
    game_review,
  }).save();

  if (!new_course) return next(new AppError("Could Not Creat Course!", 403));

  //send a response
  res.status(200).send({
    message: "Course Created Successfully!",
  });
});

//see all courses
course.getAllCourses = catchAsync(async (req, res, next) => {
  const course = await Course.find({});
  if (!course) {
    return next(new AppError(`Could not GET all courses`, 404));
  }

  //send a response
  res.status(200).send({
    message: `All courses `,
    data: { course },
  });
});

//get a course by id
course.getOneCourse = catchAsync(async (req, res, next) => {
  //find course thru _id
  const _id = req.params.id;
  //console.log(_id);

  let lesson = await handlerFactory.getById(Course, _id);
  if (!lesson) return next(new AppError("Course not found", 404));

  //send response
  res.status(200).send({
    message: `Course ${lesson.course} found`,
    data: { lesson },
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

module.exports = course;
