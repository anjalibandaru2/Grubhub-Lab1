const express = require('express');
const menuItemAccess = require('../dbAccess/menuItemAccess');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      console.log("in destination..");
    callback(null, './uploads/menuItems');
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
router.post("/addSectionToMenu", async function(req, res){
    var responseObj = {};
    let {section_type, owner_id} = req.body;
   // console.log(req.body);
    try{
        if(checkIfEmpty(section_type) || checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await menuItemAccess.addSectionToMenu(owner_id, section_type);
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
router.post("/addItem", upload.single('item_image'), async function(req, res){
    var responseObj = {};
    let {item_name, section_id, owner_id, item_description, item_price} = req.body;
    console.log("req body in add item..");
    console.log(req.body);
    try{
        if(checkIfEmpty(item_name) || checkIfEmpty(section_id) || checkIfEmpty(owner_id) || checkIfEmpty(item_description) || checkIfEmpty(item_price)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
           // section_id = section_id.toLowerCase();
            let itemDetails = { item_name, section_id, owner_id, item_description, item_price};
            //if(!checkIfEmpty(item_image)){
            if(req.file){
                //upload.single('item_image');
                let item_imageName = req.file.filename;
                itemDetails.item_image = item_imageName;
            }
            responseObj = await menuItemAccess.insertItem(itemDetails);
            //console.log(responseObj);
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

router.post("/deleteSection", async function(req, res){
    var responseObj = {};
    let {section_id, owner_id} = req.body;
    console.log(req.body);
    try{
        if(checkIfEmpty(section_id) || checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await menuItemAccess.deleteSection(owner_id, section_id);
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

router.post("/deleteItem", async function(req, res){
    var responseObj = {};
    let {item_id, owner_id} = req.body;
    try{
        if(checkIfEmpty(item_id) || checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            let itemDetails = { owner_id, item_id};
            responseObj = await menuItemAccess.deleteItem(item_id, owner_id);
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

router.post("/getAllMenuItems", async function(req, res){
    var responseObj = {};
    let { owner_id} = req.body;
    try{
        if(checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "No ownerID Found!! Please Login again!";
        } else {
            responseObj = await menuItemAccess.getAllMenuItems(owner_id);
           //console.log("responseObj..");
           //console.log(responseObj);
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

module.exports = router;
