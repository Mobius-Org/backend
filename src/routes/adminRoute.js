const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

// approve content, disaprrove content, get all contents, get one content, kick out user
router.get("./course/addContent", auth, adminController.studentUpload)

module.exports = router;