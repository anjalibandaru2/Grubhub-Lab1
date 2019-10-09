import React,{Component} from "react";
import cookie from 'react-cookies';
import {Redirect}  from 'react-router';

export var isFieldEmpty = (prop)=>{
    if(prop == "" || prop == null || typeof prop === "undefined"){
        return true;
    } else{
        return false;
    }
};
export var CheckValidOwner = ()=>{
    let user_type = cookie.load("user_type");
    let owner_id = cookie.load("owner_id");
    let name = cookie.load("name");
    let redirectVar = <div></div>;
    if(isFieldEmpty(user_type) || isFieldEmpty(owner_id) /*|| isFieldEmpty(name)*/){
        redirectVar = <Redirect to="/signin"/>;
    } 
    return redirectVar;
}
export var CheckValidBuyer = ()=>{
    let user_type = cookie.load("user_type");
    let buyer_id = cookie.load("buyer_id");
    let name = cookie.load("name");
    console.log("buyer..name..type"+buyer_id +"  "+name+" "+user_type);
    let redirectVar = <div></div>;
    if(isFieldEmpty(user_type) || isFieldEmpty(buyer_id) || isFieldEmpty(name)){
        console.log("inside if of valid buyer..");
        redirectVar = <Redirect to="/signin"/>;
    } 
    return redirectVar;
}
export var RedirectToBuyerHome=()=>{
    let user_type = cookie.load("user_type");
    let buyer_id = cookie.load("buyer_id");
    let name = cookie.load("name");
    let redirectVar = <div></div>;
    if(!isFieldEmpty(user_type) && !isFieldEmpty(buyer_id) && !isFieldEmpty(name)){
        redirectVar = <Redirect to="/buyer/buyerHome"/>;
    } 
    return redirectVar;
}
export var RedirectToUserHome=()=>{
    if(getUserType() == "owner"){
        RedirectToOwnerHome();
    } else if(getUserType() == "buyer"){
        RedirectToBuyerHome();
    }
}
export var RedirectToOwnerHome=()=>{
    let user_type = cookie.load("user_type");
    let owner_id = cookie.load("owner_id");
    let name = cookie.load("name");
    let redirectVar = <div></div>;
    if(!isFieldEmpty(user_type) && !isFieldEmpty(owner_id) && !isFieldEmpty(name)){
        redirectVar = <Redirect to="/owner/ownerHome"/>;
    } 
    return redirectVar;
}

/* redirectToOwnerHome=()=>{

}*/
export var getUserName = ()=> {
    let name = cookie.load("name");
    if(!isFieldEmpty(name)){
        return name;
    } else {
        return "";
    }
}
export var getUserType = ()=> {
    let user_type = cookie.load("user_type");
    if(!isFieldEmpty(user_type)){
        return user_type;
    } else {
        return "";
    }
}
export  var getOwnerID = ()=> {
    let owner_id = cookie.load("owner_id");
    if(!isFieldEmpty(owner_id)){
        return owner_id;
    } else {
        return "";
    }
}
export var getBuyerID = ()=> {
    let buyer_id = cookie.load("buyer_id");
    console.log("buyer_id is..");
    console.log(buyer_id);
    if(!isFieldEmpty(buyer_id)){
        return buyer_id;
    } else {
        return "";
    }
}

export var handleLogout = () => {
    cookie.remove('user_type', { path: '/' });
    cookie.remove('user_id', { path: '/' });
    cookie.remove('name', { path: '/' });
}
/*export var genericapis = {
    isFieldEmpty, CheckValidOwner, CheckValidBuyer, getUserName, handleLogout, redirectToBuyerHome, getOwnerID, getBuyerID, redirectToOwnerHome
}*/
