import express from "express";
import {
  addfood,
  listfood,
  removefood,
} from "../controllers/foodController.js";
import multer from "multer";
const foodrouter = express.Router();

// Image upload route

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}` + "-" + `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodrouter.post("/add", upload.single("image"), addfood);
foodrouter.get("/list", listfood);
foodrouter.post("/delete/:id", removefood);

export default foodrouter;
