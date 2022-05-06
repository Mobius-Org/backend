const router = require('express').Router();
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

// subscribe to newsletter
router.post(
    "/subscribe",
    userController.subscribe
);


module.exports = router;