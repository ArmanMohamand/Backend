import express from "express";
import {
  addToCart,
  removeFromCart,
  getCartItems,
} from "../controllers/cartController.js";

import verifyUser from "../middleware/auth.js";

const cartrouter = express.Router();

cartrouter.post("/add", verifyUser, addToCart);
cartrouter.post("/remove", verifyUser, removeFromCart);
cartrouter.post("/get", verifyUser, getCartItems);

export default cartrouter;
