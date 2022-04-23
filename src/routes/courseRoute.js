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
router.post(
  "/newContent",
  courseController.upload,
  courseController.createContent
);
//get all courses
router.get("/all", courseController.getAllCourses);
//get one course
router.get("/:id", courseController.getOneCourse);
//post user being enrolled     /first id is the course in question while the second id is tht if the user being enrolled
router.patch("/:id", auth, courseController.enrollCourse);

// upload content video :id ==> id of the course in question
router.post(
  "/:id",
  courseController.upload,
  courseController.uploadContent
);

router.post(
  "/test",
  courseController.upload,
  courseController.uploadContent
)

module.exports = router;
