const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const courseSchema = new Schema(
  {
    courseId: {
      type: String,
      unique: true
    },
    courseName: reqStr,
    sections: {
      introduction: {
        title: reqStr,
        transcript: reqStr,
        video: reqStr,
        text: reqStr,
      },
      contents: [
        {
          title: String,
          transcript: String,
          video: String,
          description: String,
          duration: String
        },
      ],
      game: {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
      studentCreation: {
        title: reqStr,
        video: reqStr,
        transcript: reqStr,
        text: reqStr,
      },
    },
    description: {
      price: reqStr,
      shortSummary: reqStr,
      summary: reqStr,
      age: reqStr,
      duration: {
        type: String,
        default: "0:0"
      },
      modules: {
        type: Number,
        default: 3
      },
      languges: String,
      badges: {
        type: String,
        default: "Yes"
      },
      image: String,
      studentEnrolled: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    courseReview: {
      happy: Number,
      sad: Number,
      neutral: Number,
      total: Number,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

//// INSTANCE METHODS
// Add Sections
courseSchema.methods.addSections = function (
  introduction,
  game,
  studentCreation
) {
  this.sections.introduction = introduction;
  this.sections.game = game;
  this.sections.studentCreation = studentCreation;
};

// Add Description
courseSchema.methods.addDescription = function (descr) {
  this.description = descr;
};

// // Add Course Contents
courseSchema.methods.addContents = function (content) {
    let cTime = content.duration.split(':'),
        dTime = this.description.duration.split(':'),
        cTimeMins = Number(cTime[0]),
        cTimeSecs = Number(cTime[1]),
        dTimeSecs = Number(dTime[1]),
        tsecs = dTimeSecs + cTimeSecs,
        dTimeMins = Number(dTime[0]) + cTimeMins + Math.floor(tsecs / 60);
    dTimeSecs = tsecs % 60;
    
    this.description.duration = String(dTimeMins) + ":" + String(dTimeSecs);
    this.description.modules ++;
    this.sections.contents.push(content);
};

// Create Review
courseSchema.methods.review = function (review) {
  const num2Perc = (review, total) => {
    return Math.floor(review / total);
  };

  const perc2Num = (reviewPerc, total) => {
    return Math.floor(reviewPerc * total);
  };

  // check review zero state
  if (this.courseReview.total === 0) {
    // add new review
    this.courseReview[review]++;
    this.courseReview.total++;
  } else {
    let total = this.courseReview.total;
    (this.courseReview.happy = perc2Num(this.courseReview.happy, total)),
      (this.courseReview.sad = perc2Num(this.courseReview.sad, total)),
      (this.courseReview.neutral = perc2Num(this.courseReview.neutral, total));

    // add new review
    this.courseReview[review]++;
    this.courseReview.total++;

    // convert back to percentage
    (this.courseReview.happy = num2Perc(this.courseReview.happy, total)),
      (this.courseReview.sad = num2Perc(this.courseReview.sad, total)),
      (this.courseReview.neutral = perc2Num(this.courseReview.neutral, total));
  }
};

// Enroll Students
courseSchema.methods.enroll = function (sId) {
  this.description.studentEnrolled.push(sId);
};

module.exports = model("Course", courseSchema);
