import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, CheckValidBuyer} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";

export class BuyerPastOrders extends Component {
    state={
        isRendered : false,
        pastOrders : []
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.state.pastOrders = [];
    }
    componentDidMount = async()=>{
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        }
        await axios({
            method: 'post',
            url: "http://localhost:3001/buyerPastOrders",
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
                    pastOrders : responseData.message.orders
                });
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
    }
    renderPastOrders=()=>{
        let renderItemsInOrder = (items) =>{
            let itermsArr = [];
            for(let i=0; i<items.length; i++){
                let item = items[i];
                itermsArr.push(
                    <Row key={i} className="orderItem">
                        <Col xs={3}>{item.item_name}</Col>
                        <Col xs={3}>{item.item_quantity}</Col>
                        <Col xs={3}>{item.item_calculatedPrice}</Col>
                </Row>
                )
            }
            return(
                itermsArr
            );
        }
        let renderEachOrder = function(order,index){
            return (
                <Card key={index}>
                    <Card.Body>
                        <Card.Title><h2>{order.owner_restName}</h2></Card.Title>
                       <h6>Order status : {order.order_status}</h6>

                       {renderItemsInOrder(order.items)}
                    </Card.Body>
                </Card>
            );
        }

        let ordersList =[];
        for(let index = 0; index < this.state.pastOrders.length; index++){
            let order = this.state.pastOrders[index];
            ordersList.push(renderEachOrder(order, index));
        }
       return  (<div>{ordersList}</div>)
    }

    render(){
        if(!this.state.isRendered){
            return <div></div>
        }
        if(this.state.isRendered){
            if(typeof this.state.pastOrders === "undefined" || this.state.pastOrders.length == 0){
                return <div>No past orders</div>
            } else {
                console.log(this.state.pastOrders);
                return(
                    <div>
                        <CheckValidBuyer/>
                         <BuyerNavbar/>
                         <Container>
                        <Card>YOUR ORDERS</Card>
                        {this.renderPastOrders()}
                        </Container>
                    </div>
                );
            }
        }   
    }
}
export default BuyerPastOrders;