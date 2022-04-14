const router = require("express").Router();
const courseController = require("../controllers/courseController");

//create course
router.post("/newcourse", courseController.create);
//get all courses
router.get("/all", courseController.getAllCourses);
//get one course
router.get("/:id",courseController.getOneCourse)

module.exports = router;
