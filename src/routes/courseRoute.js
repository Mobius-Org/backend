const router           = require("express").Router();
const { auth }         = require("../middlewares/auth");
const courseController = require("../controllers/courseController");

//create course
router.post(
  "/createCourse",
  auth,
  // checkAuth,
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
router.get(
    "/all",
    courseController.getAllCourses
);

//get one course
router.get(
    "/getOne/:id",
    courseController.getOneCourse
);

//post user being enrolled
router.post(
    "/enroll/:id",
    auth,
    courseController.enrollCourse
);

//get my courses
router.get(
    "/dashboard/myCourses",
    auth,
    courseController.getMyCourses
);

router.get(
    "/enroll/verify-transactions/",
    courseController.verify
);

// student upload content
router.post(
    "/student-upload",
    auth,
    courseController.upload,
    courseController.studentUpload
);

module.exports = router;
