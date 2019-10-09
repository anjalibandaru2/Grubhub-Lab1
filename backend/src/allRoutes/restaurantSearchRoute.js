const express = require('express');
const restaurantSearchdb = require('../dbAccess/restaurantSearchdb.js');
const router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


router.post("/filterRestaurants", async function(req, res){
    let{itemOrCuisine} = req.body;
    var responseObj = {};
    try {
        console.log("get restaurants list..");
        responseObj = await restaurantSearchdb.filterRestaurants(itemOrCuisine);
    } catch(e) {
        console.log(e);
        responseObj.status = false;
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});
router.post("/getCuisineList", async function(req, res){
    var responseObj = {};
    try {
        responseObj = await restaurantSearchdb.getCuisineList();
    } catch(e) {
        console.log(e);
        responseObj.status = false;
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});

router.post("/getRestaurantDetails", async function(req, res){
    let {owner_id} = req.body;
    let responseObj = {};
    try {
        responseObj = await restaurantSearchdb.getRestaurantDetails(owner_id);
    } catch(e) {
        console.log(e);
        responseObj.status = false;
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});

module.exports = router;
