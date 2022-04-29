const router = require("express").Router();
const courseController = require("../controllers/courseController");
const { auth } = require("../middlewares/auth");

//create course
router.post(
  "/createCourse",
  // auth,
  courseController.upload,
  courseController.createCourse
);

//create content
router.patch(
  "/addContent",
  courseController.upload,
  courseController.createContent
);
//get all courses
router.get("/all", courseController.getAllCourses);

//get one course
router.get("/getOne/:id", courseController.getOneCourse);

//post user being enrolled     /first id is the course in question while the second id is tht if the user being enrolled
router.patch("/enroll/:id", auth, courseController.enrollCourse);

//get my courses
router.get("/dashboard/myCourses", auth, courseController.getMyCourses);

// //student upload content
// router.patch(
//   "/student/uploadcontent",
//   auth,
//   courseController.upload,
//   courseController.studentUpload
// );

module.exports = router;
