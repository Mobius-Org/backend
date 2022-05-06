const router = require('express').Router();
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// update progress
router.patch(
    "/view-course/update-progress/:courseId",
    auth,
    userController.updateProgress
);

// set game rewards
router.patch(
    "/view-course/set-game-score/:courseId",
    auth,
    userController.setGameRewards
);

// get my contents
router.get(
    "/dashboard/my-contents",
    auth,
    userController.getMyContents
);

// get my badges
router.get(
    "/dashboard/my-badges/:courseId",
    auth,
    userController.getMyBadges
);

// subscribe to newsletter
router.post(
    "/subscribe",
    //Validation
    body('email').isEmail(),
    userController.subscribe
);

module.exports = router;