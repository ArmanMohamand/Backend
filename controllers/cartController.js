import userModel from "../models/userModel.js";

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Validate input
    if (!userId || !itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or itemId" });
    }

    const userdata = await userModel.findById(userId);

    if (!userdata) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartdata = userdata.cart || {};

    cartdata[itemId] = (cartdata[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cart: cartdata });

    res
      .status(200)
      .json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or itemId" });
    }

    const userdata = await userModel.findById(userId);

    if (!userdata) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartdata = userdata.cart || {};

    if (cartdata[itemId]) {
      cartdata[itemId] -= 1;
      if (cartdata[itemId] <= 0) {
        delete cartdata[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cart: cartdata });

    res
      .status(200)
      .json({ success: true, message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch cart items
const getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const userdata = await userModel.findById(userId);

    if (!userdata) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cart: userdata.cart || {} });
  } catch (error) {
    console.error("Error in getCartItems:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, removeFromCart, getCartItems };
