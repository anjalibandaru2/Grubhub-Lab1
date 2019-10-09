import React,{Component} from "react";
import {Navbar, Nav} from 'react-bootstrap';
import {handleLogout, getUserName} from "../genericapis.js";
import grubhubImg from "./../../images/grubhubImg.JPG";

function OwnerNavbar(){
    /* return (
         <Navbar bg="dark" variant="dark">
             <Nav className="mr-auto">
                 <Nav.Link href="/owner/menu">Menu</Nav.Link>
                 <Nav.Link href="/owner/profile">Profile</Nav.Link>
                 <Nav.Link href="/" onClick={handleLogout}>Signout</Nav.Link>
                 <Nav.Link href="/ownerUpcomingOrders">Upcoming Orders</Nav.Link>
                 <Nav.Link href="/ownerPastOrders">Past Orders</Nav.Link>
             </Nav>
         </Navbar>
     );*/
     let name = getUserName();
     return(
        <div className=" sticky-top">
        <Navbar className="ownerTopNav">
           <img src={grubhubImg}/>
            <Nav className="ml-auto">     
                <div className="float-right"><Nav.Link className = "ownerTopNavElement float-right" href="/ownerProfile"> Hi, {name}</Nav.Link></div>
                <div className="float-right"><Nav.Link className = "ownerTopNavElement" href="/ownerProfile">Profile</Nav.Link></div>
                <div className="float-right"><Nav.Link href="/owner/menu">Menu</Nav.Link></div>
                <div className="float-right"><Nav.Link className = "ownerTopNavElement" href="/ownerPastOrders">Past Orders</Nav.Link></div>
                <div className="float-right"><Nav.Link className = "ownerTopNavElement" href="/ownerUpComingOrders">Upcoming Orders</Nav.Link></div>
                <div className="float-right"><Nav.Link className = "ownerTopNavElement" href="/" onClick={handleLogout}>Signout</Nav.Link></div>
            </Nav>
        </Navbar>
        </div>
     );
 }
 export default OwnerNavbar;