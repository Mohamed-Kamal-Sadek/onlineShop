const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    birthday: {type: Date},
    mobile:{type:String},
    address:{type: String},
    city:{type:String},
    gender:{type:String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {type: Boolean, default: false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);