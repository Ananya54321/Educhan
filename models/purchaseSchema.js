const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema({
  courseId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  creatorId: Schema.Types.ObjectId,
});

module.exports = mongoose.model("Purchase", purchaseSchema);
