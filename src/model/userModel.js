const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const UserSchema = new Schema(
  {
    name: reqStr,
    age: { type: Number, required: true },
    favColor: reqStr,
    email: reqStr,
    password: reqStr,
    enrolledCourse: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    
    ],

    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timeStamp: true }
);

const User = model("User", UserSchema);

module.exports = User;
