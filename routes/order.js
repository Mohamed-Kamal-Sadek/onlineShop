const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
////////////////////////////////////////////////////
const router = require("express").Router();
////////////////////////////////////////////////////
const dotenv = require("dotenv");
dotenv.config();
////////////////////////////////////////////////////
const path = require('path')
//var nodemailer = require('nodemailer');
//var hbs = require('nodemailer-express-handlebars');
////////////////////////////////////////////////////
///////////////// TWILIO SMS ////////////////////////
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSidSMS = "AC6982c008eb074a0e919acce2d328a1c9";
const authTokenSMS = process.env.TWILIO_AUTH_TOKEN_SMS;
const clientSMS = require("twilio")(accountSidSMS, authTokenSMS);
////////////////////////////////////////////////////
////////////// WhatsApp // Twilio Kimo2ndAccount ///
const accountSidWhatsApp = 'AC9ad4b0222b08311c490ada60064c63d9';
const authTokenWhatsApp = process.env.TWILIO_AUTH_TOKEN_WHATSApp;
const clientWhatsApp = require('twilio')(accountSidWhatsApp, authTokenWhatsApp);

///////////////////////////////////////////////////////////////////////
var oldUser;
///////////////////////////////////////////////////////////////////////////////////////////////
///////// user view user_show_order.ejs (by place order button in user_show_cart.ejs)//////////
router.get("/user_show_order/:cart_id", verifyToken, async (req, res) => {

  try{
    oldCart = await Cart.findOne({_id:req.params.cart_id});
    oldUser = await User.findOne({_id:req.user.id});
    
    if(oldCart && oldUser){
    
      userData={userId:oldUser._id,
                username:oldUser.username,
                mobile:oldUser.mobile,
                address:oldUser.address,
                city:oldUser.city 
              };
    
      res.status(200).render('user_show_order',{oldCart:oldCart, userData:userData}) // to show user data at user_show_order.ejs
    }else{res.render('home')}
  }catch(err){
  res.status(500).json(err)
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////send mail fn. using nodemailer package only ////////////////////////
/*
function sendEmail(){
  return new Promise((resolve, reject) => {

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth:{
          user:'kimo74g@gmail.com',
          pass:'ofzkplborowldgwr'
        }
      });
    const mail_configs ={
      from:'hi <kimo74g@gmail.com>',
      to: `bi <${oldUser.email}>`,
      subject:`hello ${oldUser.username}`,
      text:'we have recieved your Order at localhost:5000'
    };
    transporter.sendMail(mail_configs, function(error, info){
      if(error){
        console.log(error)
        return reject({message:'an error has occured'})
      }
      return resolve({message:'email sent syccesfully'})
    })
  })
}
*/
///////////////////////////////////////////////////////////////////////////////////////////////
//////////send HTML mail fn. using nodemailer & nodemailer-express-handlebars packages ////////
/*
function sendHTMLemail(){
  return new Promise((resolve, reject) => {

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth:{
          user:'kimo74g@gmail.com',
          pass:'ofzkplborowldgwr'
        }
      });

      const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve(__dirname,'../views'),
          defaultLayout: false,
        },
        viewPath: path.resolve(__dirname,'../views'),
        extName: ".handlebars",
      }
      
      transporter.use('compile', hbs(handlebarOptions));


    const mail_configs ={
      from:'<kimo74g@gmail.com>',
      to: `<${oldUser.email}>`,
      subject:`hello ${oldUser.username}`,
      template: 'email',
      context: {
        title: 'Title Here', /// this is variable 1 sent to <h1>{{title}}</h1> in email.handlebars
        text: "Lorem ipsum dolor sit amet, consectetur..." /// this is variable 2 sent to <p>{{text}}</p> in email.handlebars
      }
    };
    transporter.sendMail(mail_configs, function(error, info){
      if(error){
        console.log(error)
        return reject({message:'an error has occured'})
      }
      return resolve({message:'email sent syccesfully'})
    });
  });
};
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////
//// user Place Order to db (and delete cart) by place order button in user_show_order.ejs //////////

router.post("/", verifyToken, async (req, res) => {
  const orderData = req.body;

  var products=[] ;
  for(var k=6; k<(parseInt(Object.keys(orderData).length - 3)) ; k += 8){ //3 represents deliverCost, orderPrice , PaymentMethod
    for(var i= 0; i<1 ; i++){
      product={
        productId:Object.values(orderData)[(k)], 
        //title:Object.values(orderData)[(k+1)], // cause i minimized order data
        //img:Object.values(orderData)[(k+2)],
        //size:Object.values(orderData)[(k+3)],
        //color:Object.values(orderData)[(k+4)],
        //price:Object.values(orderData)[(k+5)],
        quantity:Object.values(orderData)[(k+6)], 
        subTotalPrice:Object.values(orderData)[(k+7)]
      }
      products.push(product)
    }
  }
  //console.log(products);
  const myOrder = {
    userId:orderData.userId,
    cartId:orderData.cartId,
    products:products,
    deliverCost:orderData.deliverCost,
    orderPrice:orderData.orderPrice
    //status:""            // i stopped it to make the default being bending
  }
  //console.log(newOrder)
  const newOrder = new Order(myOrder);
  try {
    const savedOrder = await newOrder.save();
    await Cart.findByIdAndDelete(req.body.cartId);// deleting cart after successfuly saving order
    
    ////////Sending Email >>>>>>>>>>>>>>>>
     /*
    await sendEmail();    // they affect sending alert message from index.js in assests
    await sendHTMLemail(); // may be some settings of package changed
    */
    ////////Sending SMS >>>>>>>>>>>>>>>>>
    await clientSMS.messages
    .create({ body: "Order saved pending", from: "+12766336413", to: "+201002221973" })
    .then(message => console.log(message.sid));

    ////////Sending WhatsApp >>>>>>>>>>>>>>>>>
    
    await clientWhatsApp.messages
    .create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+201119168993'
    })
    .then(message => console.log(message.sid))
    //.done();  // it affect sending alert message from index.js in assests


    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
///////////////////////////////////////////////////////////////////////
////////////////////// User_Show_All_Orders ///////////////////////////
router.get('/user_show_all_orders',verifyToken, async (req, res) => {
  const me = await User.findOne({_id:req.user.id});// bring the user (by req.user.id from verifyToken fn.)
  var orders = await Order.find({userId:req.user.id}); // bring all orders of the user in array
  if(orders && me){
    try {
      for(var i = 0; i < orders.length; i++){
        var productsOfOneOrder = new Array(); // array of objects
        for(var k = 0; k < orders[i].products.length; k++){
          var oneProduct = await Product.findOne({_id:orders[i].products[k].productId}); 
          //console.log(oneProduct) ok
          productsOfOneOrder.push({
                                    productId:oneProduct.id,
                                    title:oneProduct.title,
                                    img:oneProduct.img,
                                    size:oneProduct.size,
                                    color:oneProduct.color,
                                    price:oneProduct.price,
                                    quantity:orders[i].products[k].quantity,
                                    subTotalPrice:orders[i].products[k].subTotalPrice
                                  });
        };
        //console.log(productsOfOneOrder)         //ok
        //orders[i].products = productsOfOneOrder; // not ok not not not not not not not working
        orders[i].xx = productsOfOneOrder; //عملت اسناد جديد لان الاسناد في السطر السابق لم ينفع
        //console.log(orders[i].xx) //  ok
      };
      res.status(200);
      res.render('user_show_all_orders',{user:me, orders:orders });
    } catch (err) {
      res.status(500).json(err);
    }
  }
});
///////////////////////////////////////////////////////////////////////
////////////////////// Admin_Show_All_Orders ///////////////////////////
router.get('/admin_show_all_orders',verifyTokenAndAdmin, async (req, res) => {
  
  var orders = await Order.find(); // bring all orders in array
  if(orders){
    try {
      for(var i = 0; i < orders.length; i++){
        var productsOfOneOrder = new Array(); // array of objects
        for(var k = 0; k < orders[i].products.length; k++){
          var oneProduct = await Product.findOne({_id:orders[i].products[k].productId}); 
          //console.log(oneProduct) ok
          productsOfOneOrder.push({
                                    productId:oneProduct.id,
                                    title:oneProduct.title,
                                    img:oneProduct.img,
                                    size:oneProduct.size,
                                    color:oneProduct.color,
                                    price:oneProduct.price,
                                    quantity:orders[i].products[k].quantity,
                                    subTotalPrice:orders[i].products[k].subTotalPrice
                                  });
        };
        //console.log(productsOfOneOrder)         //ok
        //orders[i].products = productsOfOneOrder; // not ok not not not not not not not working
        orders[i].xx = productsOfOneOrder; //عملت اسناد جديد لان الاسناد في السطر السابق لم ينفع
        //console.log(orders[i].xx) //  ok
      };
      res.status(200);
      res.render('admin_show_all_orders',{orders:orders });
    } catch (err) {
      res.status(500).json(err);
    }
  }
});
//////////////////////////////////////////////////////////////////////////////
//UPDATE
router.put("/:orderid", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderid,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/delete/:cartid", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete({cartId:req.params.cartid});
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// admin view certain user orders ///////////////////////////
router.get("/find/:userid", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let orders = new Array();
    orders = await Order.find({ userId: req.params.userid });
    //console.log(orders) //////>>>>>>> may be []
    if(orders.length > 0){ // user has orders
        for(var i = 0; i < orders.length; i++){
          var productsOfOneOrder = new Array(); // array of objects
          for(var k = 0; k < orders[i].products.length; k++){
            var oneProduct = await Product.findOne({_id:orders[i].products[k].productId});
            productsOfOneOrder.push({
                                      productId:oneProduct.id,
                                      title:oneProduct.title,
                                      img:oneProduct.img,
                                      size:oneProduct.size,
                                      color:oneProduct.color,
                                      price:oneProduct.price,
                                      quantity:orders[i].products[k].quantity,
                                      subTotalPrice:orders[i].products[k].subTotalPrice
                                    });
          };
          //console.log(productsOfOneOrder)         //ok
          //orders[i].products = productsOfOneOrder; // not ok not not not not not not not working
          orders[i].xx = productsOfOneOrder; //عملت اسناد جديد لان الاسناد في السطر السابق لم ينفع
          //console.log(orders[i].xx) //  ok
        };
        res.status(200);
        res.render('admin_show_all_orders',{orders:orders });
      } else {console.log(orders)};  //////>>>>>>> it will be []
  }catch (err) {
        res.status(500).json(err);
    }
});
/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// GET MONTHLY INCOME ////////////////////////////////
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } && {status: "complete"} },
      {$project: {month: { $month: "$createdAt" }, sales: "$amount"}},
      {$group: {_id: "$month", total: { $sum: "$sales" }}},
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////////////
module.exports = router;

