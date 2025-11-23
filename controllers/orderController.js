import orderModel from "../models/ordermodel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.stripe_secret_key);

// Place a new order

// const placeOrder = async (req, res) => {
//   const furl = "https://e-food-beta.vercel.app";

//   try {
//     const { userId, items, amount, address } = req.body;

//     if (!userId || !items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing userId or items" });
//     }

//     // Stripe line items
//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: "INR",
//         product_data: { name: item.name },
//         unit_amount: Number(item.price) * 100,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency: "INR",
//         product_data: { name: "Delivery Charges" },
//         unit_amount: 20 * 100,
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       success_url: `${furl}/verify?success=true&userId=${userId}&amount=${amount}`,
//       cancel_url: `${furl}/verify?success=false&userId=${userId}`,
//     });

//     res.status(200).json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.error("Error in placeOrder:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const placeOrder = async (req, res) => {
  const furl = "https://e-food-beta.vercel.app";
  // const furl = "http://localhost:5173";

  try {
    const { userId, items, amount, address, promoCode } = req.body;

    if (!userId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or items" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: { name: "Food Order" },
            unit_amount: amount * 100, // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${furl}/verify?success=true&userId=${userId}&amount=${amount}&promoCode=${
        promoCode || ""
      }`,
      cancel_url: `${furl}/verify?success=false&userId=${userId}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// // web hooks for stripe payment verification can be added later
// Verify order (save only if payment succeeded)
const verifyOrder = async (req, res) => {
  const { userId, items, amount, address, success } = req.body;
  try {
    if (success === true || success === "true") {
      const newOrder = new orderModel({
        userId,
        items,
        amount,
        address,
        payment: true,
      });
      await newOrder.save();

      // Clear user's cart
      await userModel.findByIdAndUpdate(userId, { cart: {} });

      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      res
        .status(200)
        .json({ success: false, message: "Payment failed, order not saved" });
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
