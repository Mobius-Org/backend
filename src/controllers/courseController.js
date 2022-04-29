const fs = require("fs");
const User = require("../model/userModel");
const upload = require("../middlewares/multer");
const Course = require("../model/courseModel");
const AppError = require("../errors/appError");
const Payment = require('../model/paymentModel');
const paystack = require('../services/paystack');
const catchAsync = require("../utils/catchAsync");
const { cloudUpload } = require("../utils/cloudinary");

const courseController = {};

// multer
courseController.upload = upload.array("files", 3);

//create a course
courseController.createCourse = catchAsync(async (req, res, next) => {
  let { courseName, introduction, studentCreation, description, game } =
    req.body;
  //courseName = JSON.parse(courseName);

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

  // get image and videos for
  let media = [],
    urls = [];
  if (req.files) {
    const files = req.files;
    media = files.map((file) => file.path);
  }
  for (let i = 0; i < media.length; i++) {
    let path = media[i],
      url = await cloudUpload(path);

    if (!url) {
      fs.unlinkSync(path);
      return next(new AppError("Network Error!", 503));
    }
    fs.unlinkSync(path);
    urls.push(url);
  }

  // Add the images and videos
  description = JSON.parse(description);
  introduction = JSON.parse(introduction);
  studentCreation = JSON.parse(studentCreation);
  introduction.video = urls[0].url;
  studentCreation.video = urls[1].url;
  description.image = urls[2].url;

  //instance methods
  newCourse.addSections(introduction, game, studentCreation);
  newCourse.addDescription(description);

  //save the schema
  await newCourse.save((err, result) => {
    if (err) return next(new AppError({ message: err.message }, 400));
    else {
      //send a response
      res.status(201).send({
        message: "Course Created Successfully!",
      });
    }
  });
});

//create new content
courseController.createContent = catchAsync(async (req, res, next) => {
  let { courseId, content } = req.body;

  // check if a course exists
  const course = await Course.findOne({ courseId });
  if (!course) return next(new AppError("Course not found", 404));

  // get video for content
  let videoUrl;
  if (req.files) {
    const path = req.files[0].path;
    videoUrl = await cloudUpload(path);

    if (!videoUrl) {
      fs.unlinkSync(path);
      return next(new AppError("Network Error!", 503));
    }
    fs.unlinkSync(path);
  }

  content = JSON.parse(content);
  content.video = videoUrl.url;

  // add content to course
  course.addContents(content);

  //save the schema
  await course.save((err, result) => {
    if (err) return next(new AppError({ message: err.message }, 400));
    else {
      //send a response
      res.status(201).send({
        status: "success",
        message: "Course Content Added Successfully!",
      });
    }
  });
});

//see all courses MO B-17
courseController.getAllCourses = catchAsync(async (req, res, next) => {
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

  let course = await Course.findOne({ courseId });
  if (!course) return next(new AppError("Course not found", 404));

  //send response
  res.status(200).send({
    status: "success",
    course,
  });
});

// enroll in a course
courseController.enrollCourse = catchAsync(async (req, res, next) => {
  //find course by  id
  const courseId = req.params.id;

  let course = await Course.findOne({ courseId });
  if (!course)
    return next(new AppError(`Course with id: ${courseId} not found`, 404));

  //find user
  let user = await User.findById({ _id: req.USER_ID });
  if (!user) return next(new AppError("Authorization Failed", 401));

  // check if user is already enrolled in course
  if (user.enrolledCourses.includes(course._id)) {
    return res.status(208).send({
      status: "success",
      message: "Already Enrolled In Course"
    })
  };

  //check if course is free
  if (course.description.price === "Free") {
    // change course data by adding a new enrolled student
    course.enroll(req.USER_ID);
    //add course to a students data
    user.enroll(course.courseId, course._id);

    // save user and send response to client
    user.save((err, _) => {
      if (err) return next(new AppError("Could Not Enroll User, Something Went Wrong", 400));
      course.save((err, _) => {
        if (err) return next(new AppError("Could Not Enroll User, Something Went Wrong", 400));
        //send response
        res.status(200).send({
          status: "success",
          message: `Successfully enrolled in course: ${course.courseName}`,
        });
      })
    });
  } else {
    // Payment
    let email = user.email,
      amountTrue = course.description.price,
      amount = String(Number(course.description.price) * 100);

    paystack.initalizeTransaction(
      {
        email,
        amount,
        metadata: {
          email,
          amountTrue,
          courseId,
          userId: user._id,
          name: user.getFullName()
        }
      }, res);
  };
});


// verify payment
courseController.verify = catchAsync(async (req, res, next) => {
  const ref = req.query.reference;
  paystack.verify(ref, Course, User, Payment, res);
});

// get courses a user enrolled in
courseController.getMyCourses = catchAsync(async (req, res, next) => {
  //find user
  User.findById({ _id: req.USER_ID })
    .populate({ path: "enrolledCourses" }).then(result => {
      if (!result) return next(new AppError("Could not get my courses", 400));
      //send response
      else {
        res.status(200).send({
          status: "success",
          result: result.enrolledCourses
        });
      }
    });
});

module.exports = courseController;
