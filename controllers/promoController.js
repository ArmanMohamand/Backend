import Promo from "../models/promomodel.js";

// Create promo code
const createPromo = async (req, res) => {
  try {
    const { code, discount, type, expiresAt } = req.body;

    if (!code || !discount) {
      return res
        .status(400)
        .json({ success: false, message: "Code and discount are required" });
    }

    const promo = new Promo({
      code: code.toUpperCase(),
      discount,
      type,
      expiresAt,
    });

    await promo.save();
    res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      promo,
    });
  } catch (error) {
    console.error("Create promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all promo codes
const listPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: promos });
  } catch (error) {
    console.error("List promos error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply promo code at checkout
const applyPromo = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const promo = await Promo.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid promo code" });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code expired" });
    }

    let newAmount = amount;
    if (promo.type === "flat") {
      newAmount = amount - promo.discount;
    } else {
      newAmount = amount * (1 - promo.discount / 100);
    }

    newAmount = Math.max(0, Math.round(newAmount));

    res.json({ success: true, newAmount, promo });
  } catch (error) {
    console.error("Apply promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const togglePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );

    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Promo not found" });
    }

    res.json({ success: true, message: "Promo status updated", promo });
  } catch (error) {
    console.error("Toggle promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removePromo = async (req, res) => {
  try {
    const promoId = req.params.id;
    const promo = await Promo.findByIdAndDelete(promoId);

    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Promo not found" });
    }

    res.json({ success: true, message: "Promo deleted successfully" });
  } catch (error) {
    console.error("Remove promo error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createPromo, listPromos, applyPromo, togglePromo, removePromo };
