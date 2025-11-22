import userModel from "../models/userModel.js";
//  Add item to cart
const addToCart = async (req, res) => {
  try {
    let userdata = await userModel.findOne({ _id: req.body.userId });
    let cartdata = userdata.cart || {};

    if (!cartdata[req.body.itemId]) {
      cartdata[req.body.itemId] = 1;
    } else {
      cartdata[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cart: cartdata });

    res
      .status(200)
      .json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

//  Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    let userdata = await userModel.findOne({ _id: req.body.userId });
    let cartdata = userdata.cart || {};

    if (cartdata[req.body.itemId]) {
      cartdata[req.body.itemId] -= 1;
      if (cartdata[req.body.itemId] <= 0) {
        delete cartdata[req.body.itemId];
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cart: cartdata });

    res
      .status(200)
      .json({ success: true, message: "Item removed from cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

// Fetch cart items
const getCartItems = async (req, res) => {
  try {
    let userdata = await userModel.findOne({ _id: req.body.userId });
    res.status(200).json({ success: true, cart: userdata.cart || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ERROR" });
  }
};

export { addToCart, removeFromCart, getCartItems };
