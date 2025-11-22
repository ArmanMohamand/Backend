import mongoose from "mongoose";
const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["flat", "percent"], default: "flat" },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Promo = mongoose.models.Promo || mongoose.model("Promo", promoSchema);
export default Promo;
