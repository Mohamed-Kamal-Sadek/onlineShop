const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cartId: { type: String }, // to search for cart and delete it.
    products: [
                {
                  productId:{type: String},
                  quantity:{type: Number, default: 1}, 
                  subTotalPrice:{type: Number, default: 0}
                }
              ],
    deliverCost:{type: Number, default: 0},
    orderPrice:{type: Number, default: 0},
    status:{type:String, default:'pending'}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);