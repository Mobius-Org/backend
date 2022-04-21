const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const courseSchema = new Schema(
  {
    courseId: String,
    course: reqStr,
    sections: {
      introduction: {
        title: reqStr,
        transcript: reqStr,
        video: reqStr,
        text: reqStr
      },
      contents: [],
      game: {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
      studentCreation: {
        name: reqStr,
        video: reqStr,
        transcript: reqStr,
        text: reqStr
      }
    },
    description: {
      price: Number,
      summary: reqStr,
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
      total: Number
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);


//// INSTANCE METHODS
// Create Sections
courseSchema.methods.addSections = function(introduction, game, studentCreation) {
    this.sections.introduction = introduction;
    this.sections.game = game;
    this.sections.studentCreation = studentCreation;
};

// Add Course Contents
courseSchema.methods.addContents = function(contentsArr) {
  for (let i=0; i<contentsArr.length; i++){
    this.sections.contents = [ ...this.sections.contents, ...contentsArr ];
  };
};

// Create Review
courseSchema.methods.review = function(review) {
    const num2Perc = (review, total) => {
      return Math.floor(review / total);
    };

    const perc2Num = (reviewPerc, total) => {
      return Math.floor(reviewPerc * total);
    };

    // check review zero state
    if ( this.couresReview.total === 0 ) {
      // add new review
      this.courseReview[review] ++;
      this.couresReview.total ++;
    } else {
      let total = this.courseReview.total;
        this.courseReview.happy = perc2Num(this.courseReview.happy, total),
        this.courseReview.sad = perc2Num(this.courseReview.sad, total),
        this.courseReview.neutral = perc2Num(this.courseReview.neutral, total);

      // add new review
      this.courseReview[review] ++;
      this.couresReview.total ++;

      // convert back to percentage
      this.courseReview.happy = num2Perc(this.courseReview.happy, total),
      this.courseReview.sad = num2Perc(this.courseReview.sad, total),
      this.courseReview.neutral = perc2Num(this.courseReview.neutral, total);
    } 
}

module.exports = model("Course", courseSchema);