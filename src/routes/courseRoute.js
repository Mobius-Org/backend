const router = require("express").Router();
const courseController = require("../controllers/courseController");

//create course
router.post("/newcourse", courseController.create);

router.get("/all", courseController.getAllCourses);

module.exports = router;
