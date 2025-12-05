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

// const listfood = async (req, res) => {
//   try {
//     const foods = await foodmodel.find({}).lean() ;
//     res.json({ success: true, data: foods });
//   } catch (error) {
//     console.error("List food error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

let cachedFoods = null;
let lastFetchTime = null;

const listfood = async (req, res) => {
  try {
    if (cachedFoods && Date.now() - lastFetchTime < 60000) {
      return res.json({ success: true, data: cachedFoods });
    }

    const foods = await foodmodel.find({}).lean();
    cachedFoods = foods;
    lastFetchTime = Date.now();

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
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }
    if (food.image) {
      fs.unlinkSync(`uploads/${food.image}`);
    }
    res.status(200).json({ success: true, message: "Food item removed" });
  } catch (error) {
    console.error("Remove food error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addfood, listfood, removefood };
