// const mongoose = require("mongoose");
// async function connectMongoose(url) {
//   return mongoose.connect(url);
// }
// module.exports = {
//   connectMongoose,
// };
import mongoose from "mongoose";

export async function connectMongoose(url) {
  return mongoose.connect(url);
}
