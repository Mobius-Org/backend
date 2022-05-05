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
  contents: [
    {
      title: String,
      video: String,
      description: String,
      duration: String,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

// instance methods
// // Student add Contents
studentContentSchema.methods.addContents = function (content) {
  //let cTime = content.duration.split(":"),
  //   dTime = this.description.duration.split(":"),
  //   cTimeMins = Number(cTime[0]),
  //   cTimeSecs = Number(cTime[1]),
  //   dTimeSecs = Number(dTime[1]),
  //   tsecs = dTimeSecs + cTimeSecs,
  //   dTimeMins = Number(dTime[0]) + cTimeMins + Math.floor(tsecs / 60);
  // dTimeSecs = tsecs % 60;

  // this.contents.duration = String(dTimeMins) + ":" + String(dTimeSecs);
  this.contents.push(content);
};

module.exports = model("StudentContent", studentContentSchema);
