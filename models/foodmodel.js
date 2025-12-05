import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    discription: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);
foodSchema.index({ category: 1 });

const foodmodel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodmodel;
