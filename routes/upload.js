const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
////////////////////////////////////////////////////////////////////////////////////////////////
const path = require("path");
const multer = require("multer");
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////directory and file name assignment by Multer///////////////////////////////
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
      callback(null, "assets/img");
    },
    filename: (req, file, callback)=>{
        console.log(file); // data about the file or image uploaded
        //callback(null, Date.now()+ path.extname(file.originalname)); // name of saved image mixed with time
        callback(null, file.originalname); //name of saved image as the original
    }
});

const upload = multer({storage:storage})
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// registered user add cart ////////////////////////////////////
router.post("/", upload.single("image"), (req, res) => {
  console.log("Image Uploaded")
});
///////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;