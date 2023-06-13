const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
/////////////////////////////////////////////////////////////////////////////////
//////////////////// Admin show add_product_form.ejs  ///////////////////////////

router.get("/admin_add_product", verifyTokenAndAdmin, async(req, res) => {
  var adminID = req.user.id;
  let enteredby = await User.findById(adminID);
  //console.log(enteredby)
  res.render('admin_add_product', {enteredby:enteredby.username})
});
/////////////////////////////////////////////////////////////////////////////
///////////////////////// Admin Add product to db  //////////////////////////

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(
   {
    title:req.body.title,
    desc:req.body.desc,
    img:"/img/"+ req.body.img,
    categories:req.body.categories.split(","),
    size:req.body.size,
    color:req.body.color,
    price:req.body.price,
    quantity:req.body.quantity,
    enteredby:req.body.enteredby,
    active:req.body.active
   }
  );

  try {
    const savedProduct = await newProduct.save();
    //res.status(200).json(savedProduct);
    res.status(200).redirect('/admin');
  } catch (err) {
    res.status(500).json(err);
  }
});
//////////////////////////////////////////////////////////////////////////////
/////////////////////// Admin Show All Products //////////////////////////////
router.get("/admin_show_all_products",verifyTokenAndAdmin, async (req, res) => {
  const kimo = new String("kimo: Admin_search_by_all_products");
  const is_active_product ="all";
  try {
    const products = await Product.find();
    res.render('admin_show_all_products',{products:products, kimos:kimo, is_active_product:is_active_product});
    //res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
//////////////////////// Admin show active products only ///////////////////
router.get("/active_products",verifyTokenAndAdmin, async (req, res) => {
 
  const kimo = new String("Admin_search_by_active_products");
  const is_active_product = new Boolean(true);
  try {
        let activeProduct
        activeProduct = await Product.find({active:true});
        res.render('admin_show_all_products',{products:activeProduct, kimos:kimo, is_active_product:is_active_product});
    } catch (err) {
      res.status(500).json(err);
    }});
////////////////////////////////////////////////////////////////////////////
//////////////////////// Admin show Inactive products only /////////////////
router.get("/in_active_products",verifyTokenAndAdmin, async (req, res) => {
 
  const kimo = new String("Admin_search_by_inactive_products");
  const is_active_product = new Boolean(false);
  try {
        let notactiveProduct
        notactiveProduct = await Product.find({active:false});
        res.render('admin_show_all_products',{products:notactiveProduct, kimos:kimo, is_active_product:is_active_product});
    } catch (err) {
      res.status(500).json(err);
    }});
/////////////////////////////////////////////////////////////////////////////
///////////////////////// Admin Update product //////////////////////////////
router.put("/:productid", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productid,
      {
        $set: {
          title:req.body.title,
          desc:req.body.desc,
          img:req.body.img,
          categories:req.body.categories.split(","),//convert string to array
          size:req.body.size,
          color:req.body.color,
          price:req.body.price,
          quantity:req.body.quantity,
          enteredby:req.body.enteredby,
          active:req.body.active
         }
      },
      { new: true }
    );
////// SEARCH EVERY CART AND REMOVE THE INACTIVE PRODUCT
    if(updatedProduct.active == false){
      const allCarts = await Cart.find(); // array of objects
      for(var i=0; i< allCarts.length; i++){
        for(var k=0; k <allCarts[i].products.length; k++){
          if(allCarts[i].products[k].productId==req.params.productid){
            var cartId = allCarts[i]._id;
              allCarts[i].products.splice(k,1); // to remove only one element starting from no. k from array
              await Cart.findByIdAndUpdate(cartId,{$set: allCarts[i]},{ new: false });
            
          }
        }
      }
    
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////////////////////////////////////////////////////////////////////////////
///////////////////////// Admin Delete product //////////////////////////////
router.delete("/:product_id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.product_id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
////////////// Admin search products by title or part of title /////////////
router.get("/admin_search_by_title",verifyTokenAndAdmin, async (req, res) => {
  const qTitle = req.query.title;
  const kimo = new String("admin_search_by_title_or_part_of_title");
  try {
    let products;

    if (qTitle) {
      products = await Product.find({title: { $regex: '^' + qTitle, $options: 'i' }});//search by starting letters
    } else {
      products = await Product.find();
    }
    res.render('admin_show_all_products',{products:products, kimos:kimo});
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
///////////// Admin search products by category and active //////////////////
router.get("/admin_search_by_category",verifyTokenAndAdmin, async (req, res) => {
  const qCategory = req.query.categories;
  const kimo = new String("Admin_search_by_category");
  try {
    let products;

    if (qCategory) {
      products = await Product.find({categories: {$in: [qCategory]}, active:true});
    } else {
      products = await Product.find();
    }
    res.render('admin_show_all_products',{products:products, kimos:kimo});
    //res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
/////////////////////////// Admin search product by ID /////////////////////
router.get("/find/:productid",verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productid);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
//////////////////////////////////////////////////////////////////////////////
//////////////////// User Show All Active Products ///////////////////////////
router.get("/user_show_all_products", async (req, res) => {
  try {
    const kimo = new String("kimo: User Show All Active Products");
    const products = await Product.find({active:true});
    res.render('user_show_all_products',{products:products, kimos:kimo});
    //res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
///////////////// User search products by category and active //////////////
router.get("/search_by_category", async (req, res) => {
  const qCategory = req.query.categories;
  const kimo = new String("search_by_category");
  try {
    let products;

    if (qCategory) {
      products = await Product.find({categories: {$in: [qCategory]}, active:true});
    } else {
      products = await Product.find();
    }
    res.render('user_show_all_products',{products:products, kimos:kimo});
    //res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
////////////// User search products by newest 2 products and active/////////
router.get("/search_by_newest", async (req, res) => {
  const qNew = req.query.new;
  const kimo = new String("kimo:user_search_by_newest_active");
  try {
    let products;
    if (qNew) {
      products = await Product.find({active:true}).sort({ createdAt: -1 }).limit(2);
    } else {
      products = await Product.find();
    }
    res.render('user_show_all_products',{products:products, kimos:kimo});
  } catch (err) {
      res.status(500).json(err);
    }
});
////////////////////////////////////////////////////////////////////////////
//////// User search products by title or part of title and active//////////
router.get("/user_search_by_title", async (req, res) => {
  const qTitle = req.query.title;
  const kimo = new String("user_search_by_title");
  try {
    let products;

    if (qTitle) {
      products = await Product.find({title: { $regex: '^' + qTitle, $options: 'i' }, active:true});//search by starting letters
    } else {
      products = await Product.find();
    }
    res.render('user_show_all_products',{products:products, kimos:kimo});
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////////////
module.exports = router;