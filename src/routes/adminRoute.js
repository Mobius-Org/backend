const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

// approve content
router.patch("/approveContent/:id", adminController.approveContent);

// reject content
router.patch("/rejectContent/:id", adminController.rejectContent);

//get all contents
router.get("/allUploadedContent", adminController.getAllUploadedContent);

// get one content
router.get("/oneUploadedContent/:id", adminController.getOneUploadedContent);

module.exports = router;
