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


// subscribe to newsletter
router.post(
    "/subscribe",
    userController.subscribe
);


module.exports = router;