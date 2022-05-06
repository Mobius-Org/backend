const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const studentContentSchema = new Schema({
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: reqStr,
  courseTitle: reqStr,
  video: String,
  description: reqStr,
  title: reqStr,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

// instance methods

// Student upload Contents
studentContentSchema.methods.updateStatus = function (status) {
  if (status === "approved") {
    this.status = "approved";
  } else if (status === "rejected") {
    this.status = "rejected";
  }
};

module.exports = model("StudentContent", studentContentSchema);