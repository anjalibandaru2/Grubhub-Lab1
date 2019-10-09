const express = require('express');
const profileAccess = require('../dbAccess/profileAccess');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      console.log("in destination..");
    callback(null, './uploads/profilepics');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });


var checkIfEmpty = (item) => {
    if(item == null || item == "" || typeof item == "undefined"){
        return true;
    } else{
        return false;
    }
}

let base64Image = (buyer_profileImageName) =>{
    var bitmap = fs.readFileSync(buyer_profileImageName);
    return new Buffer(bitmap).toString('base64');
}
let getImageDirectory=(buyer_profieImageName)=>{
    let pathName = path.join(__dirname, '../../uploads/profilepics', buyer_profieImageName);
    return pathName;
}

router.post("/getBuyerProfile", async function(req, res){
    var responseObj = {};
    let {buyer_id} = req.body;
    try{
        console.log("in get buyer profile..");
        if(checkIfEmpty(buyer_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await profileAccess.getBuyerProfile(buyer_id);
            let isProfileImagePresent = false;
            if (!checkIfEmpty(responseObj.message.buyer_profileImage)){
                let imageFileName =getImageDirectory(responseObj.message.buyer_profileImage);
                responseObj.message.buyer_profileImage = "data:image/png;base64,"+base64Image(imageFileName);
            }
        }
    } catch(e) {
        console.log(e);
        responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});

router.post("/getOwnerProfile", async function(req, res){
    var responseObj = {};
    let {owner_id} = req.body;
    try{
        if(checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await profileAccess.getOwnerProfile(owner_id);
            if (!checkIfEmpty(responseObj.message.owner_profileImage)){
                let imageFileName =getImageDirectory(responseObj.message.owner_profileImage);
                responseObj.message.owner_profileImage = "data:image/png;base64,"+base64Image(imageFileName);
            }
            if (!checkIfEmpty(responseObj.message.owner_restImage)){
                let imageFileName =getImageDirectory(responseObj.message.owner_restImage);
                responseObj.message.owner_restImage = "data:image/png;base64,"+base64Image(imageFileName);
            }
        }
    } catch(e) {
        console.log(e);
        responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});

router.post("/updateBuyerProfile", async function(req, res){
    var responseObj = {};
    let {buyer_id, buyer_colName, buyer_colValue} = req.body;
    try{
        console.log("in update profile buyer..");
        if(checkIfEmpty(buyer_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await profileAccess.updateBuyerProfile(buyer_id, buyer_colName, buyer_colValue);
        }
    } catch(e) {
        console.log(e);
        responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});

router.post('/updateBuyerProfileImage', upload.single('selectedFile'), async function (req, res) {
    console.log("Inside post profile img");
    console.log("Request body:");
    console.log(req.body);
    let buyer_id = req.body.buyer_id;
   
    let responseObj = {};
    try {
      //add checkifempty for buyer profile pic if possible..
      console.log("filename", req.file);
      let buyer_profieImageName = req.file.filename;
      //var queryResult = [];
      responseObj = await profileAccess.updateBuyerProfileImage(buyer_id, buyer_profieImageName);
      if(responseObj.status){
          //send base64 image to client
          //override message property
          console.log(__dirname);
          let filePath = getImageDirectory(buyer_profieImageName);
          console.log(filePath);
         // let base64str = base64_encode(filePath);
          responseObj.message.buyer_profileImage = "data:image/png;base64," + base64Image( filePath);
          
      } 
    }
    catch (err) {
        responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
        console.log(err);
      //res.status(500).json({ responseMessage: 'Database not responding' });
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
  });

  router.post("/updateOwnerProfile", async function(req, res){
    var responseObj = {};
    let {owner_id, owner_colName, owner_colValue} = req.body;
    try{
        if(checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await profileAccess.updateOwnerProfile(owner_id, owner_colName, owner_colValue);
        }
    } catch(e) {
        console.log(e);
        responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});
router.post('/updateOwnerImage', upload.single('selectedFile'), async function (req, res) {
    console.log("Inside post profile img");
    console.log("Request body:");
    console.log(req.body);
    let {owner_id, owner_colName} = req.body;
    let responseObj = {};
    try {
      //add checkifempty for buyer profile pic if possible..
      console.log("filename", req.file);
      let owner_ImageName = req.file.filename;
      //var queryResult = [];
      responseObj = await profileAccess.updateOwnerProfile(owner_id, owner_colName, owner_ImageName);
      if(responseObj.status){
          //send base64 image to client
          //override message property
          console.log(__dirname);
          let filePath = getImageDirectory(owner_ImageName);
          console.log(filePath);
         // let base64str = base64_encode(filePath);
          responseObj.message[owner_colName] = "data:image/png;base64," + base64Image( filePath);
          
      } 
    }
    catch (err) {
        responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
        console.log(err);
      //res.status(500).json({ responseMessage: 'Database not responding' });
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
  });


module.exports = router;