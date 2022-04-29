const router = require('express').Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

// update progress
router.patch(
    "/view-course/update-progress",
    auth,
    userController.updateProgress
);


module.exports = router;