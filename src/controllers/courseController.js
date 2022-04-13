const Course = require("../model/courseModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/appError");

const course = {};

//see all courses
course.seeAllCourses = catchAsync(async (req, res, next) => {
  const course = Course.find({});
  if (!course) {
    return next(new AppError(`Could not GET all courses`, 404));
  }
  res.send(course);
});

//create a course
course.create = catchAsync(async (req, res, next) => {

    
});

//get a course by id
course.getOneCourse = async () => {};
