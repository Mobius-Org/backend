const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  courseId: String,
  amount: String,
  refrence: String
});

module.exports = model("Payment", paymentSchema);
