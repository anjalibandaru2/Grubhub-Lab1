import React,{Component} from "react";
import {Navbar, Nav} from 'react-bootstrap';
import {handleLogout, getUserName} from "../genericapis.js";
import grubhubImg from "./../../images/grubhubImg.JPG";

function BuyerNavbar(){
    var name = getUserName();
    console.log("name in BuyerNavbar.."+name);
     return (
         <div>
        
         <Navbar className="buyerTopNav">
            <img src={grubhubImg}/>
             <Nav className="ml-auto">     
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement float-right" href="/buyerProfile"> Hi, {name}</Nav.Link></div>
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement" href="/buyerProfile">Profile</Nav.Link></div>
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement" href="/buyer/buyerHome">Home</Nav.Link></div>
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement" href="/" onClick={handleLogout}>Signout</Nav.Link></div>
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement" href="/cart">Cart</Nav.Link></div>
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement" href="/buyerPastOrders">Past Orders</Nav.Link></div>
                 <div className="float-right"><Nav.Link className = "buyerTopNavElement" href="/buyerUpComingOrders">Upcoming Orders</Nav.Link></div>
             </Nav>
         </Navbar>
         </div>
     );
 }
 export default BuyerNavbar;