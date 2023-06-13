const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const dotenv = require("dotenv");
const bodyparser = require('body-parser');
const cors = require('cors');


const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
////////////////////////////////////////////////////////////////////
///////////////////////////show Profile/////////////////////////////////
router.post("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({_id:req.user.id});
    if(!user){
      res.status(401);
      res.json("Wrong User Name!");
    }else{
      const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
       const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
       user.password = originalPassword;////لاظهار الباسورد الاصلي
        
       res.render('profile', {user:user});
       
       //res.redirect('/');
      }
    }catch(err){
        res.status(500).json(err);
    }
});
////////////////////////////////////////////////////////////////////
///////////////////////////admin_show_all_users/////////////////////////////////
router.get("/admin_show_all_users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    if(!users){
      res.status(401);
      res.json("Wrong User Name!");
    }else{
      for(var i = 0 ; i < users.length; i++) {
        //console.log(users[i]);
      const hashedPassword = CryptoJS.AES.decrypt(users[i].password, process.env.PASS_SEC);
       const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
       users[i].password = originalPassword;////لاظهار الباسورد الاصلي
      }
       res.render('admin_show_all_users', {users:users});
      }}catch(err){
        res.status(500).json(err);
    }
});
/////////////////////////////////////////////////////////////////////////
/////////////////////////// search user by mobile ///////////////////////
router.get("/search_by_mob", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findOne({mobile:req.query.mob});
    if(!user){
      //res.status(401);
      //alert("Mobile not recorded"); //not work because we are in backend
      //location.reload();            //not work because we are in backend
      res.json("Mobile is not recorded!");
    }else{
      const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
       const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
       user.password = originalPassword;////لاظهار الباسورد الاصلي
       res.render('profile', {user:user});
      }
    }catch(err){
        res.status(500).json(err);
    }
});
/////////////////////////////////////////////////////////////////////
//////UPDATE USER by user him self in profile.ejs////////////////////
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set:req.body}, { new: true});
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
////////////////////////////////////////////////////////////////////
/////////////////////////Delete USER////////////////////////////////
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

////////////////////////////////////////////////////////////////////
///////////////////////////GET USER without password/////////////////////////////////
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////////////////////////////////////////////////////////////////////
//////////////////GET ALL USER first method//////////////////////////
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////////////////////////////////////////////////////////////////////
//GET ALL USER 2nd method///////////////////////////////////////////
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
/////////////////////////////////////////////////////////////////////
//////////////////GET USER STATS/////////////////////////////////////
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
console.log(lastYear);
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: {month: { $month: "$createdAt" } } },
      {$group: { _id: "$month", total: { $sum: 1 } } }
    ]);
    console.log(data);
    res.status(200).render("graph",{data:data})
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;