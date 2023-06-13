const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
///////////////////// add_user form /////////////////////////////
router.get('/add_user', (req, res) =>{
  res.render('add_user.ejs');
})
/////////////////////// add_user to db ///////////////////////////
router.post("/register", async (req, res) => {
const user = new User({
  username: req.body.username,
  birthday: req.body.birthday,
  mobile: req.body.mobile,
  address:req.body.address,
  city: req.body.city,
  gender: req.body.gender,
  email: req.body.email,
  password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
  isAdmin:req.body.isAdmin
})

// save user in the database
user
  .save() 
  .then(data => {
      //res.redirect('/');
      const hashedPassword = CryptoJS.AES.decrypt(data.password, process.env.PASS_SEC);
          const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
          data.password = originalPassword; 
      res.render('profile', {user:data});//but password will be shown in coded 
  })
  .catch(err =>{
      res.status(500).send({
          message : err.message || "Some error occurred while creating a create operation"
      });
  });
});
//////////////////////////////////////////////////////////////
///////////////////// login form /////////////////////////////
router.get('/login', (req, res) =>{
  res.render('login.ejs');
});
///////////////////////////////////////////////////////////////
///////////////////// logout form /////////////////////////////
router.get('/logout', (req, res) =>{
  res.render('logout.ejs');
});
///////////////////////////////////////////////////////////////
////////////////////////Login process//////////////////////////
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user){
          res.status(401);
          res.json("Wrong User Name!");
        }else{
          const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
          const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
          const inputPassword = req.body.password;
          if(originalPassword !== inputPassword){
            res.status(401)
            res.json("Wrong Password!");
          }else{
            user.password=originalPassword;////لاظهار الباسورد الاصلي
            const token = jwt.sign(
              {
                  id: user.id,
                  isAdmin: user.isAdmin,
              },
              process.env.JWT_SEC,
              {expiresIn:"1d"}
            );
            /*
            ///////////sending all data and token (except password) as a response////////
            const { password, ...others } = user._doc;  
            res.status(200)
            res.json({...others, token});
            */
           /*
           ///////////// keeping old token that made not more than one day and adding new tokens with it also///// 
           let oldToken = user.tokens || [];
           if(oldToken.length){
            oldToken = oldToken.filter(t=>{
              const timeDiff = (Date.now() - parseInt(t.signedAt))/1000;
              if(timeDiff<86400){return t};
            })
           };
           const userWithToken = await User.findByIdAndUpdate(user.id, {tokens:[...oldToken, {token, signedAt: Date.now().toString()}]});
           */
          ////////////////putting token inside httpOnly cookie ///////////
           const options = {
            httpOnly:true,
            expires:new Date(Date.now()+2000000)  //in msec
           };
           
           res.cookie('cookieToken',token, options);
           ////////render profile according to being admin or not//////////////
           if(user.isAdmin==true){res.redirect('/admin')}else{
           res.redirect('/');}
          }
        }
    }catch(err){
        res.status(500).json(err);
    }
});
////////////////////////LOGOUT////////////////////////
router.post('/logout', (req, res) => {
  res.clearCookie('cookieToken');
  res.redirect('/');
});



module.exports = router;