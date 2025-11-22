import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectMongoose } from "./connection.js";
import foodrouter from "./routes/foodroute.js";
import router from "./routes/userRoute.js";
import cartrouter from "./routes/cartroute.js";
import orderRouter from "./routes/orderRoute.js";
import promoRouter from "./routes/promorouter.js";
// Connection
connectMongoose("mongodb://127.0.0.1:27017/e-food").then(() => {
  console.log("MongoDb connected!");
});

// App config
const app = express();
const port = 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/food", foodrouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", router);
app.use("/api/cart", cartrouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoRouter);

app.get("/", (req, res) => {
  res.send("Server is Started");
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
