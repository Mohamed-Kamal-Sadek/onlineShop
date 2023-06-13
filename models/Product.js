const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: false },
    desc: { type: String, required: true, },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    quantity:{type:Number, required:true},
    enteredby: { type: String }, //<<<<<<<<<<<<<< new
    active:{type: Boolean, required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);