const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
                {
                  productId:{type: String},
                  title: {type: String},
                  img:{type: String},
                  size:{type: String},
                  color:{type: String},
                  price:{type: Number},
                  quantity:{type: Number, default: 1}, 
                  subTotalPrice:{type: Number, default: 0}
                }
              ]
  },
  { timestamps: false }
);

module.exports = mongoose.model("Cart", CartSchema);