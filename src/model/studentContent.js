const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const studentContentSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  contents: [
    {
      title: String,
      video: String,
      description: String,
      duration: String,
    },
  ],
});

module.exports = model("StudentContent", studentContentSchema);
