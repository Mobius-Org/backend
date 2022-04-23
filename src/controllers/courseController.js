const fs = require("fs");
const User = require("../model/userModel");
const upload = require("../middlewares/multer");
const Course = require("../model/courseModel");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("../utils/handlerFactory");
const { cloudUpload } = require("../utils/cloudinary");

const courseController = {};

// multer
courseController.upload = upload.array("files", 3);

//create a course
courseController.createCourse = catchAsync(async (req, res, next) => {
  let { courseName, introduction, studentCreation, description, game } = req.body;
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
  let media = [], urls = [];
  if (req.files) {
    const files = req.files;
    media = files.map(file => file.path);
  };
  for (let i = 0; i < media.length; i++) {
    let path = media[i],
      url = await cloudUpload(path);

    if (!url) {
      fs.unlinkSync(path);
      return next(new AppError("Network Error!", 503));
    }
    fs.unlinkSync(path);
    urls.push(url);
  };

  // Add the images and videos
  description = JSON.parse(description);
  introduction = JSON.parse(introduction);
  studentCreation = JSON.parse(studentCreation);
  introduction.video = urls[0].url;
  studentCreation.video = urls[1].url;
  description.image = urls[2].url;


  //instance methods
  newCourse.addSections(
    introduction,
    game,
    studentCreation
  );
  newCourse.addDescription(description);

  //save the schema
  await newCourse.save((err, result) => {
    if (err)
      return next(
        new AppError({ message: err.message }, 400));
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
  };

  content = JSON.parse(content);
  content.video = videoUrl.url;

  // add content to course
  course.addContents(content);

  //save the schema
  await course.save((err, result) => {
    if (err)
      return next(
        new AppError({ message: err.message }, 400)
      );
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

  let media = [], media1 = []
  if (req.files) {
    const files = req.files;
    media = files.map(file => file.path);
    //files.forEach((path) => cloudUpload(path));
  };
  console.log(media)
  for (let i = 0; i < media.length; i++) {
    let path = media[i]
    console.log("herr")
    let img = await cloudUpload(path);
    console.log(img);

    if (!img) {
      console.log("here")
      fs.unlinkSync(path);
      return next(new AppError("Network Error!", 503));
    }
    fs.unlinkSync(path);
    media1.push(img);
  }
  console.log(media1)

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
