import foodmodel from "../models/foodmodel.js";
import fs from "fs";

// Add food item
const addfood = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const image_filename = req.file.filename;

    const food = new foodmodel({
      name: req.body.name,
      discription: req.body.discription,
      price: req.body.price,
      image: image_filename,
      category: req.body.category,
    });

    await food.save();
    res.status(200).json({ message: "Food item added successfully" });
  } catch (error) {
    console.error("Add food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// all food items

const listfood = async (req, res) => {
  try {
    const foods = await foodmodel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("List food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// remove food item

const removefood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await foodmodel.findByIdAndDelete(foodId);
    fs.unlinkSync(`uploads/${food.image}`);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }
  } catch (error) {
    console.error("Remove food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addfood, listfood, removefood };
