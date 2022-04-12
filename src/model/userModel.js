const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
  lowercase: true
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
      }
    ],
  },
  { 
    timeStamp: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  } 
});

const User = model("User", UserSchema);

module.exports = User;
