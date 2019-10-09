import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";

export class Cart extends Component{
    state={
        isRendered : false,
        cartItems : "",
        orderPlacedMessage : ""
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.state.cartItems = "";
    }
    componentDidMount = async()=>{
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        }
        await axios({
            method: 'post',
            url: "http://localhost:3001/getCart",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {buyer_id : buyer_id},
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                return response.data;
            })
            .then((responseData) => {
                //swal(responseData.responseMessage + " Try logging in.");
                //console.log("after response...");
                console.log(responseData.message);
                this.setState({
                    isRendered : true,
                    cartItems : responseData.message
                });
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
    }
    placeOrder = async ()=>{
        //request to server..
        //show message on response from server
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data = {
            buyer_id 
        };
        await axios({
            method: 'post',
            url: "http://localhost:3001/placeOrder",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {buyer_id : buyer_id},
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                return response.data;
            })
            .then((responseData) => {
                //swal(responseData.responseMessage + " Try logging in.");
                //console.log("after response...");
                console.log(responseData.message);
                if(responseData.status){
                    this.setState({
                        orderPlacedMessage : responseData.message
                    });
                } else{
                    alert(responseData.message);
                }
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
    }

    renderCartItems=()=>{
        let renderListItem = function(item,index){
            return (
                <Row key={index} className="cartItem">
                    <Col xs={3}>{item.item_name}</Col>
                    <Col xs={3}>{item.item_quantity}</Col>
                    <Col xs={3}>{item.item_calculatedPrice}</Col>
                    <Col xs={3}>put delete icon</Col>
                </Row>
            );
        }
        let itemsList =[];
        for(let index = 0; index < this.state.cartItems.length; index++){
            let item = this.state.cartItems[index];
            itemsList.push(renderListItem(item, index));
        }
       return  (<div>{itemsList}</div>)
    }

    render(){
        if(!this.state.isRendered){
            return <div></div>
        }
        if(this.state.isRendered){
            if( this.state.cartItems == ""){
                return (
                    <div>
                        <BuyerNavbar/> 
                        <div>No items in the cart</div>
                    </div>
                )
            } else {
                console.log(this.state.cartItems);
                return(
                    <div>
                        <BuyerNavbar/>
                        <Container>
                            <Card>YOUR ORDER</Card>
                            {this.renderCartItems()}   
                            <Row>
                                <button className="btn btn-success" onClick={this.placeOrder}>Place Order</button>
                            </Row>
                            {this.state.orderPlacedMessage}
                        </Container>
                    </div>
                );
            }
        }   
    }
}

export default Cart;