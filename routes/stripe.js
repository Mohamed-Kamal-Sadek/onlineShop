const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
//////////////////////////////////////////////////////////////////////////////////////////
const dotenv = require("dotenv"); // found in main file index.js
dotenv.config();
const stripeSecretKey = (process.env.STRIPE_SECRET_KEY);
const stripePublicKey= process.env.STRIPE_PUBLIC_KEY;
const stripe = require("stripe")(stripeSecretKey);
//////////////////////////////////////////////////////////////////////////////////////////
/// showing payment form with Total price (getting from cart db) and STRIPE_PUBLIC_KEY ///
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// send to stripeKey.ejs //////////////////////////////////////////

router.get("/:cartId", verifyToken, async (req, res) => {
  var cartId = req.params.cartId;
  const key = process.env.STRIPE_PUBLIC_KEY;
  
  try{
      user_show_cart = await Cart.findOne({_id:cartId});
      user_show_order = await Order.findOne({cartId:cartId});
      if(user_show_cart){
        var Total = new Number(0);
        var Total2 = new Number(0);
        for(var i = 0; i < user_show_cart.products.length; i++) {
          Total = (Total + new Number(user_show_cart.products[i].subTotalPrice));
        }
        Total2 = ((Total * 100)+1000); // 1000 for delivery
        res.render('stripeKey.ejs',{cartPrice: Total2, key: key, cartId: cartId})
      }else if(user_show_order){
        user_show_order.orderPrice *= 100;
        res.render('stripeKey.ejs',{cartPrice: user_show_order.orderPrice, key: key, cartId: cartId})
      }else{res.render('home')}
    }catch(err){
    res.status(500).json(err)
  }
});
///////////////////////////////////////////////////////////////////////////////////
/////////////////////this receives from stripeKey.ejs ///////////////////////////////////
/////////order.js    المفروض هنا هعمل الاوردر الجديد وامسح الكارت زى بالضبط ////
router.post("/payment/:cartId", verifyToken, async(req, res) => {

  var cartId = req.params.cartId;
  var user_id = req.user.id;

  let myCart = await Cart.findOne({_id: cartId});
  let PendingOrder = await Order.findOne({cartId:cartId});
  if(myCart){
    
    var products=[] ;
    for(var k=0; k < myCart.products.length ; k++){ 
      
        product={
          productId:myCart.products[k].productId, 
          //title:myCart.products[k].title,
          //img:myCart.products[k].img,
          //size:myCart.products[k].size,
          //color:myCart.products[k].color,
          //price:myCart.products[k].price,
          quantity:myCart.products[k].quantity, 
          subTotalPrice:myCart.products[k].subTotalPrice
        };
        products.push(product);
      
    };

    var myOrder = {
            userId:user_id,
            cartId:cartId,
            products:products,
            deliverCost:new Number(10),
            orderPrice:(req.body.data_amount/100),
            status:'payed'
    };
      
    try {

      stripe.charges.create(
        {
          source: 'tok_visa',
          amount: req.body.data_amount, 
          currency: "usd",
        },
        async (stripeErr, stripeRes) => {  //// i made async fn here cause it contains await inside
          if (stripeErr) {
            res.status(500).json(stripeErr);
          } else {
            const newOrder = new Order(myOrder);
            const savedOrder = await newOrder.save();
            await Cart.findByIdAndDelete(cartId);// deleting cart after successfuly saving order
            return res.status(200).redirect("/api/orders/user_show_all_orders"); 
          }
        }
      )
        
    }catch(err){
        return res.status(500).json(err);
    }     
  }else if(PendingOrder){
    try {

      stripe.charges.create(
        {
          source: 'tok_visa',
          amount: req.body.data_amount, 
          currency: "usd",
        },
        async (stripeErr, stripeRes) => {  //// i made async fn here cause it contains await inside
          if (stripeErr) {
            res.status(500).json(stripeErr);
          } else {
            PendingOrder.status ='payed';
            const savedOrder = await PendingOrder.save();
            return res.status(200).redirect("/api/orders/user_show_all_orders"); 
          }
        }
      )
        
    }catch(err){
        return res.status(500).json(err);
    }   
  }
})
 

module.exports = router;