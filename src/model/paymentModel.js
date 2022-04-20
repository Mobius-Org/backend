const { Schema, model } = require("mongoose");
const reqStr = {
  type: String,
  required: true,
};

const PaymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  course: { type: Schema.Types.ObjectId, ref: "course" },
  price: { type: Number }
});

const Payment = model("Payment", PaymentSchema);

module.exports = Payment;
