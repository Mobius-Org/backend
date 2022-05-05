const jwt               = require("../services/jwt");
const crypto            = require("../services/crypto");
const { Schema, model } = require("mongoose");

// prototype to convert strings to title
String.prototype.toTitleCase = function(){
  return this.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}


const reqStr = {
  type: String,
  required: true,
  lowercase: true,
  trim: true
};

const userSchema = new Schema(
  {
    name: reqStr,
    age: {
      type: Number,
      required: true
    },
    favColor: reqStr,
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    password: {
      hash: {
        type: String,
        required: true
      },
      salt: String
    },
    enrolledCourses:[
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    enrolledCoursesDetails: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
        id: String,
        progress: {
          status: {
            type: String,
            default: "Start"
          },
          idx: Number,
          progress: Number
        },
        gameScore: Number,
        certificate: {
          certId : String,
          acquiredDate: Date,
          status: {
            type: String,
            enum: [ false, "acquired", "in progress" ],
            lowercase: true,
            trim: true
          }
        },
        badges: {
          gameBadge: {
            type: String,
            enum: ["acquired", "in progress"],
            lowercase: true,
            trim: true,
            default: "in progress"
          },
          creatorBadge: {
            type: String,
            enum: ["acquired", "in progress"],
            lowercase: true,
            trim: true,
            default: "in progress"
          }
        }
      },
    ],
    lastLoginTime: Date,
    lastLogoutTime: Date,
    passwordChangedAt: {
      type: Date,
      default: new Date()
    },
    token: String,
    resetToken: {
      type: String,
      default: ""
    }
  },
  {
    timeStamp: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  });


//// Instance Methods
// Set Password
userSchema.methods.setPassword = function(password) {
  this.password.salt = crypto.salt();
  this.password.hash = crypto.hash(password, this.password.salt);
};

// Validate Password
userSchema.methods.isValidPassword = function(password) {
  const hash = crypto.hash(password, this.password.salt);
  return this.password.hash === hash;
};

// Generate Token
userSchema.methods.genJwt = function() {
  const expire = new Date();
  expire.setDate( expire.getDate() + 1);
  return jwt.sign({ id: this._id, email: this.email, name: this.name });
};

// Generate Reset Token
userSchema.methods.genResetToken = function() {
  const expire = new Date();
  expire.setDate( expire.getDate() + 1);
  return jwt.signResetToken({ id: this._id }, this.password.hash );
};

// Enroll In A Course
userSchema.methods.enroll = function(id, cId) {
  this.enrolledCoursesDetails.push({ courseId: cId, id });
  this.enrolledCourses.push(cId);
};

// Certify
userSchema.methods.certify = function(id, certStatus=undefined, certId=undefined) {
  let certificate = this.enrolledCoursesDetails.filter(course => course.id === id)[0].certificate;
  if (certStatus === "acquired") {
    certificate.status = certStatus;
    certificate.certId = certId;
    certificate.acquiredDate = new Date();
  } else if (certStatus === false) {
    certificate.status = certStatus;
  } {
    certificate.status = "in progress";
  };
  this.enrolledCoursesDetails.filter(course => course.id === id)[0].certificate = certificate;
};

// Set Game Badge
userSchema.methods.setGameBadge = function(id) {
  this.enrolledCoursesDetails.filter(course => course.id === id).badges.gameBadge = "acquired";
};

// Set Game Badge
userSchema.methods.setCreatorBadge = function(id) {
  this.enrolledCoursesDetails.filter(course => course.id === id).badges.creatorBadge = "acquired";
};

// Set Game Score
userSchema.methods.setScore = function(id, score) {
  this.enrolledCoursesDetails.filter(course => course.id === id).gameScore = score;
};

// Set Course Progress
userSchema.methods.setProgress = function(id, currSection, progress) {
  let currCourse = this.enrolledCoursesDetails.filter(course => course.id === id)
  currCourse.idx = currSection;
  currCourse.progress = progress;
  if (progress === 100){
    currCourse.status = "Completed"
  } else {
    currCourse.status = "Continue"
  }
  this.enrolledCoursesDetails.filter(course => course.id === id) = currCourse;
};

// Get Name
userSchema.methods.getFullName = function(){
  return this.name.toTitleCase();
};


module.exports = model("User", userSchema);
