import orderModel from "../models/ordermodel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.stripe_secret_key);

// Place a new order

const placeOrder = async (req, res) => {
  const furl = "http://localhost:5174";

  //   baad me bdlna h frontend ke url se

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear user's cart after placing order
    await userModel.findByIdAndUpdate(req.body.userId, { cartdata: {} });

    // res
    //   .status(200)
    //   .json({ success: true, message: "Order placed successfully" });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Convert to smallest currency unit
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${furl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${furl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

// web hooks for stripe payment verification can be added later
// now we will use a temp verification method
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body; // <-- use body instead of query
  try {
    if (success === true || success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: "true" });
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

// list orders for adminPanel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};
// update order status
const orderStatusUpdate = async (req, res) => {
  try {
    const updated = await orderModel.findByIdAndUpdate(
      req.body.orderId,
      { status: req.body.status },
      { new: true } // to return the updated document
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order status updated", data: updated });
  } catch (error) {
    console.log("Status update error:", error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, orderStatusUpdate };
