const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: Schema.Types.ObjectId,
});

module.exports = mongoose.model("Course", courseSchema);
