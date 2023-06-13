const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require('cors');
//////////////////////server////////////////////////
const app = express();
////////////////////////////////////////////////////
dotenv.config();
///////////////connecting to db ////////////////////
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });
///////////////////stripe///////////////////////////
const stripeSecretKey = (process.env.STRIPE_SECRET_KEY);
const stripePublicKey= process.env.STRIPE_PUBLIC_KEY;
const stripe = require("stripe")(stripeSecretKey);
///////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) =>{
  res.render('home.ejs');
  //res.sendFile(path.resolve(__dirname, "index.html")); //used with html files only
})
/////////////////////////// Admin Page ////////////////////////////////////
app.get('/admin', (req, res) =>{
  res.render('admin_entrance.ejs');
})
///////////////////////// importing routes ////////////////////////////////
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const uploadRoute = require("./routes/upload");
//////////////////////////////////////////////////////////////////////////////////
app.use(cors());

app.use(bodyparser.urlencoded({extended:false}))//i replaced lines 45,46 with it.
app.use(bodyparser.json())

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));//without it you can't save from _form.ejs new user to db
app.use(cookie());
app.use(morgan('tiny'));
////////////////////////// using route when pass is... ///////////////////////////////
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/stripe", stripeRoute);
app.use("/api/upload", uploadRoute);
/////////////////////////////////////////////////////////
///////////////set view engine///////////////////////////
app.set("view engine","ejs");
app.set("views", path.resolve(__dirname,"views"));//can be removed
/////////////////////////////////////////////////////////
////////////load assets (static folders)/////////////////
app.use('/css', express.static(path.resolve(__dirname, "assets/css"))); //so, in ejs file, write /css not assets/css
app.use('/img', express.static(path.resolve(__dirname, "assets/img"))); //so, in ejs file, write /img not assets/img
app.use('/js', express.static(path.resolve(__dirname, "assets/js"))); //so, in ejs file, write /js not assets/js
////////////////////////////////////////////////////////////////////////////
/////////////////////////// connecting server  /////////////////////////////
app.listen(process.env.PORT || 5000, ()=>{console.log(`Server run on http://localhost:${process.env.PORT}`)});