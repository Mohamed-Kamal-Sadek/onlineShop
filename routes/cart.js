const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// registered user add cart //////////////////////////////////////////////////
router.post("/", verifyToken, async (req, res) => {
  //let olduser = {};
  olduser = await Cart.findOne({userId:req.user.id});
  if(olduser){//user has already a cart
    const foundProductIndex = olduser.products.findIndex(p => p.productId == req.body.productId);
      if(foundProductIndex>=0){ // user added a product that is found before
        olduser.products[foundProductIndex].quantity = Number.parseInt(olduser.products[foundProductIndex].quantity) + Number.parseInt(req.body.productQuantity);
        olduser.products[foundProductIndex].subTotalPrice = (olduser.products[foundProductIndex].quantity * req.body.productPrice);
      }else{ // user added a product that is not found before
        olduser.products.push(
                              { 
                                productId:req.body.productId,
                                title:req.body.productTitle,
                                img:req.body.productImg,
                                size:req.body.productSize,
                                color:req.body.productColor,
                                price:req.body.productPrice, 
                                quantity:req.body.productQuantity, 
                                subTotalPrice:(req.body.productQuantity * req.body.productPrice)
                              }
                              );
      };
      
      try {
        olduser = await olduser.save();
        return res.status(201).send(olduser);
      } catch (err) {
        res.status(500).json(err);
      };
     
  }else{//user has not a cart before
  let cart = {userId:req.user.id,
              products:[
                        {
                          productId:req.body.productId,
                          title:req.body.productTitle,
                          img:req.body.productImg,
                          size:req.body.productSize,
                          color:req.body.productColor,
                          price:req.body.productPrice,
                          quantity:req.body.productQuantity, 
                          subTotalPrice:(req.body.productQuantity * req.body.productPrice)
                        }
                      ]
              }
  const newCart = new Cart(cart);
 
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
}
});
////////////////////////////////////////////////////////////////////////
/////////////////// registered user view his cart //////////////////////
router.get("/user_show_cart", verifyToken, async (req, res) => {
  try{
      user_show_cart = await Cart.findOne({userId:req.user.id});
      if(user_show_cart){
        res.render('user_show_cart',{user_show_cart:user_show_cart})
      }else{res.render('home')} // user hase not any product in a cart return to home.ejs
    }catch(err){
    res.status(500).json(err)
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////// registered user update his cart ///////////////////////////////////////////
router.put("/:id", verifyToken, async (req, res) => {
  let myCart = await Cart.findOne({_id: req.params.id});
  if(myCart){
    const foundProductIndex = myCart.products.findIndex(p => p.productId == req.body.productId);
    if(foundProductIndex>=0){
      myCart.products[foundProductIndex].quantity = Number.parseInt(req.body.quantity);
      myCart.products[foundProductIndex].subTotalPrice = (req.body.quantity * req.body.price);
    }
    try {
      const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{$set: myCart},{ new: false });
      return res.status(201).send(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});
///////////////////////////////////////////////////////////////////////////////////
///////// registered user delete a product from his cart //////////////////////////
router.put("/delete_product/:cartId/:productId", verifyToken, async (req, res) => {
  let myCart = await Cart.findOne({_id: req.params.cartId});
  if(myCart){
    const foundProductIndex = myCart.products.findIndex(p => new String( p.productId).trim() === new String(req.params.productId).trim());
    if(foundProductIndex >= 0){
      myCart.products.splice(foundProductIndex, 1);
      try {
        await Cart.findByIdAndUpdate(req.params.cartId,{$set: myCart},{ new: false });
        return res.status(201).send(myCart);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }
});
////////////////////////////////////////////////////////////////////////
/////////////////// registered user delete his cart ////////////////////
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////
/////////////////// Admin view certain user cart /////////////////////
router.get("/find/:userid", verifyTokenAndAdmin, async (req, res) => {
  
  try{
    const cart = await Cart.findOne({ userId: req.params.userid }); // findOne returns an object.
    if(cart){                                                       //but find returns an array.
      res.render('admin_show_cart',{cart:cart})
    } // user has not any product in his cart 
  }catch(err){
    res.status(500).json(err)
  }

});
////////////////////////////////////////////////////////////////////////
/////////////////// Admin get all carts ////////////////////

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;