import React,{Component} from "react";
import {Navbar, Nav, Row, Col} from 'react-bootstrap';
import GrubHubHomeImage from "../images/GrubHubHomeImage.JPG";
import '../App.css';
import { Link } from 'react-router-dom';

export function GrubhubHome(){
    /*
    <Navbar bg="dark" variant="dark">
        <Nav className="mr-auto">
            <Nav.Link href="/signupbuyer">Signup(Buyer)</Nav.Link>
            <Nav.Link href="/signupowner">Signup(Owner)</Nav.Link>
            <Nav.Link href="/signin">SignIn</Nav.Link>
        </Nav>
        </Navbar> 
        
    */
    return (
        <div className="grubhubHome">
        <Row>
            <Col xs={6}>
                <img src={GrubHubHomeImage} className="img-fluid"/>
            </Col>
            <Col xs={6}>
                <Row id="grubhubsigninLink">
                    <Link to ="/signin">
                        <h4> Sign in </h4>
                    </Link>
                </Row>
                <Row id="grubhubMessage">
                   <h1> Order food from your favourite restaurants </h1>
                </Row>
            </Col>
        </Row>
        <Row className="jumbotron">
            <Col xs={6} id="aboutGrubhub"> <h1>About Grubhub</h1> </Col>
            <Col xs={6}> Grubhub helps you find and order food from wherever you are. How it works: you type in an address, we tell you the restaurants that deliver to that locale as well as showing you droves of pickup restaurants near you. Want to be more specific? Search by cuisine, restaurant name or menu item. We'll filter your results accordingly. When you find what you're looking for, you can place your order online or by phone, free of charge.
            </Col>
        </Row>
        </div>
    );
}

export default GrubhubHome;