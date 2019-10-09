const express = require('express');
const orderAccessBuyer = require('../dbAccess/orderAccessBuyer');
const orderAccessOwner = require('../dbAccess/orderAccessOwner');
const router = express.Router();

var checkIfEmpty = (item) => {
    if(item == null || item == "" || typeof item == "undefined"){
        return true;
    } else{
        return false;
    }
}

router.post("/placeOrder", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {buyer_id, totalPrice} = req.body;
    try{
        if(checkIfEmpty(buyer_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await orderAccessBuyer.placeOrder(buyer_id, totalPrice);
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

router.post("/buyerUpcomingOrders", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {buyer_id} = req.body;
    try{
        console.log("in buyer upcoming orders..");
        if(checkIfEmpty(buyer_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await orderAccessBuyer.buyerUpcomingOrders(buyer_id);
        }
        
       // console.log(responseObj);
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

router.post("/buyerPastOrders", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {buyer_id} = req.body;
    try{
        console.log("in buyer past orders..");
        if(checkIfEmpty(buyer_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await orderAccessBuyer.buyerPastOrders(buyer_id);
        }
        
       // console.log(responseObj);
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


router.post("/ownerUpcomingOrders", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {owner_id} = req.body;
    try{
        if(checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await orderAccessOwner.ownerUpcomingOrders(owner_id);
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

router.post("/ownerPastOrders", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {owner_id} = req.body;
    console.log("in owner past orders..");
    try{
        if(checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await orderAccessOwner.ownerPastOrders(owner_id);
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



router.post("/updateOrderStatus", async function(req, res){
    console.log(req.body);
    var responseObj = {};
    let {order_id, order_status} = req.body;
   
    try{
        if(checkIfEmpty(order_id) || checkIfEmpty(order_status)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
        } else {
            responseObj = await orderAccessOwner.updateOrderStatus(order_id, order_status);
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