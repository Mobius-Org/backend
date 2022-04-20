const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const CourseSchema = new Schema({
  courseId: {type: String},
  course: reqStr,
  introduction: reqStr,
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
  },
  description: {
    price: { type: Number },
    summary: reqStr,
    student_enrolled: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: { type: Number },
  },
  course_review: reqStr,
  game_review: reqStr,
});

const Course = model("Course", CourseSchema);

module.exports = Course;
