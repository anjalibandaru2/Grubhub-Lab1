const express = require('express');
const signupAndSignIn = require('../dbAccess/signupAndSignIn');
const router = express.Router();
const sha1 = require('sha1');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


router.post("/signupowner", async function(req, res){
    let{email, password, name, restName, restZipcode} = req.body;
    var responseObj = {};
    console.log("In signup owner route..");
    try {
        password = sha1(password);
        email = email.toLowerCase().trim();
        let ownerDetails = {
            owner_name : name,
            owner_email : email,
            owner_password : password,
            owner_restName : restName,
            owner_restZipcode : restZipcode
        };
        //console.log("before calling dao signup..");
        responseObj = await signupAndSignIn.signupOwner(ownerDetails);
        
    } catch(e) {
        console.log(e);
        responseObj.status = false;
    } finally{
        res.status(200).json({
            ...responseObj
        });
    }
});

router.post("/signupbuyer", async function(req, res){
    console.log("in signup buyer route..");
    let {email, password, name}  = req.body;
    let responseObj = {};
    console.log("In signup buyer route..");
    try {
        password = sha1(password);
        email = email.toLowerCase().trim();
        let buyerDetails = {
            buyer_name : name,
            buyer_email : email,
            buyer_password : password
        };
        console.log(buyerDetails);
        responseObj = await signupAndSignIn.signupBuyer(buyerDetails);
        //res.cookie("cookie1",'admin',{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = email;
    } catch(e) {
        buyerID = -1;
        status = false;
        console.log(e);
    } finally{
        res.status(200).json({
           ...responseObj
        });
    }
});

router.post("/signin", async function(req, res){
    console.log("in signin route..");
    console.log(req.body);
    let {email, password, userType}  = req.body;
    email = email.toLowerCase().trim();
    password = sha1(password);
    let buyerID = -1;
    let status = false;
    console.log("In signin dbaccess..");
    try{
        let userData = {
            email : email,
            password : password,
            userType : userType
        };
        var responseObj = await signupAndSignIn.signIn(userData);
        status = responseObj.status;
        let user_id = userType === "owner" ? "owner_id" : "buyer_id";
        let user_name = userType === "owner" ? "owner_name" : "buyer_name";
        let name = responseObj.name;
        
        console.log(responseObj);
        if(status){
            res.cookie("user_type",userType,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie(user_id,responseObj[user_id],{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie("name",responseObj.name,{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = email;
        }
       /* res.writeHead(200,{
            "status" : 200,
            'Content-Type' : 'text/plain'
        })*/
        console.log("responseObj....");
        console.log(responseObj);
    }catch(e){
        console.log(e);
        status = false;
    }
    finally{
       // res.end(JSON.stringify({...responseObj,status:status}));
       res.status(200).json({
        ...responseObj
     });
      
    }
});

module.exports = router;