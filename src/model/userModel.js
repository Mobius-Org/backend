const jwt = require("../services/jwt");
const crypto = require("../services/crypto");
const { Schema, model } = require("mongoose");


const reqStr = {
  type: String,
  required: true,
  lowercase: true
};

const userSchema = new Schema(
  {
    name: reqStr,
    age: { type: Number, required: true },
    favColor: reqStr,
    email: reqStr,
    password: {
      hash: {
        type: String,
        required: true
      },
      salt: String
    },
    enrolledCourse: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      }
    ],
    lastLoginTime: Date,
    lastLogoutTime: Date,
    passwordChangedAt: {
      type: Date,
      default: new Date()
    },
    token: String,
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
  return jwt.signResetToken({ id: this._id });
};
module.exports = model("User", userSchema);
