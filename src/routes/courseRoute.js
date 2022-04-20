const router = require("express").Router();
const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");

//create course
router.post("/newcourse", courseController.create);
//get all courses
router.get("/all", courseController.getAllCourses);
//get one course
router.get("/:id", courseController.getOneCourse);
//post user being enrolled     /first id is the course in question while the second id is tht if the user being enrolled
router.patch("/:id", auth.auth, courseController.enrollCourse);

module.exports = router;
