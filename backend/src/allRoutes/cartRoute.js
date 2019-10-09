const express = require('express');
const cartAccess = require('../dbAccess/cartAccess');
const router = express.Router();

var checkIfEmpty = (item) => {
    if(item == null || item == "" || typeof item == "undefined"){
        return true;
    } else{
        return false;
    }
}

router.post("/addToCart", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {item_id, item_quantity, buyer_id, item_calculatedPrice} = req.body;
    try{
        if(checkIfEmpty(item_id) || checkIfEmpty(item_quantity) || checkIfEmpty(buyer_id) || checkIfEmpty(item_calculatedPrice)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            let itemDetails = {item_id, item_quantity, buyer_id, item_calculatedPrice};
            responseObj = await cartAccess.addToCart(itemDetails);
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

router.post("/getCart", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {buyer_id} = req.body;
    try{
        if(checkIfEmpty(buyer_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await cartAccess.getCart(buyer_id);
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

router.post("/deleteFromCart", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {item_id} = req.body;
    try{
        if(checkIfEmpty(item_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await cartAccess.deleteFromCart(item_id);
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