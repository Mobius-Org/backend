const { Schema, model } = require("mongoose");

const PaymentSchema = new Schema({
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
  course: {
    type: Schema.Types.ObjectId,
    ref: "course"
  },
  price: Number
});

module.exports = model("Payment", PaymentSchema);
