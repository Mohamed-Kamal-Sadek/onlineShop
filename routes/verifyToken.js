const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const dotenv = require("dotenv");

const verifyToken = (req, res, next) => {
  const token = req.cookies.cookieToken;
  
  if (token) {
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;/// here user consists of id & isAdmin only
      next();
    });
  } else {
    //res.render('login');
    //res.redirect('auth/login');
    return res.status(401).json("You are not authenticated!");// return useless
  }
};
///////////////////////////////////////////////////////////////////
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.id || req.user.isAdmin) {
      next();
    } else {
      res.render('login');
      //res.status(403).json("You are not alowed to do that!");
    }
  });
};
//////////////////////////////////////////////////////////////////
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res,()=>{
    if(req.user.isAdmin){
      next();
    } else {
      res.render('login');
      //res.status(403).json("You are not admin to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
};