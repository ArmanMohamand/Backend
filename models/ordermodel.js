import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipcode: { type: String },
    phone: { type: String },
  },
  status: {
    type: String,
    enum: ["Processing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Processing",
  },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
