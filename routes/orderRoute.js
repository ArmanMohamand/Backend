import express from "express";
import verifyUser from "../middleware/auth.js";

import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  orderStatusUpdate,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/placeorder", verifyUser, placeOrder);
orderRouter.post("/verifyorder", verifyUser, verifyOrder);
orderRouter.post("/userorders", verifyUser, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", orderStatusUpdate);

export default orderRouter;
