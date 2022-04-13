const Course = require("../model/courseModel");
const catchAsync = require("../utils/catchAsync");
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
  res.send(course);
});

//get a course by id
course.getOneCourse = async () => {};

module.exports = course;
