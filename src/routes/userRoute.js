const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// update progress
router.patch(
    "/view-course/update-progress",
    auth,
    userController.updateProgress
);

// subscribe to newsletter
router.patch(
    "/subscribe",
    userController.subscribe
);


module.exports = router;