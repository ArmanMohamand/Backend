import express from "express";
import {
  createPromo,
  listPromos,
  applyPromo,
  togglePromo,
  removePromo,
} from "../controllers/promoController.js";

const promoRouter = express.Router();

//  creates a new promo code
promoRouter.post("/create", createPromo);

//  lists all promo codes
promoRouter.get("/list", listPromos);

// User applies a promo code at checkout
promoRouter.post("/apply", applyPromo);

// Admin toggles promo status (activate/deactivate)
promoRouter.patch("/:id/toggle", togglePromo);

// Admin deletes a promo code
promoRouter.delete("/delete/:id", removePromo);

export default promoRouter;
