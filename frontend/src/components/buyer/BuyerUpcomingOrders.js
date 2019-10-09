import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID, CheckValidBuyer} from "../genericapis.js";
import BuyerNavbar from "./BuyerNavbar.js";

export class BuyerUpcomingOrders extends Component {
    state={
        isRendered : false,
        upcomingOrders : []
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.state.upcomingOrders = [];
    }
    componentDidMount = async()=>{
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        let data ={
            buyer_id 
        }
        await axios({
            method: 'post',
            url: "http://54.147.235.117:3001/buyerUpcomingOrders",
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
                    upcomingOrders : responseData.message.orders
                });
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
    }
    renderUpcomingOrders=()=>{
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
                       <h6>Total price : {order.totalPrice}</h6>
                    </Card.Body>
                </Card>
            );
        }

        let ordersList =[];
        for(let index = 0; index < this.state.upcomingOrders.length; index++){
            let order = this.state.upcomingOrders[index];
            ordersList.push(renderEachOrder(order, index));
        }
       return  (<div>{ordersList}</div>)
    }

    render(){
        if(!this.state.isRendered){
            return <div></div>
        }
        if(this.state.isRendered){
            if(typeof this.state.upcomingOrders === "undefined" || this.state.upcomingOrders.length == 0){
               // return (<div>No upcoming orders</div>)
                return(<div>
                    <CheckValidBuyer/>
                    <BuyerNavbar/>
                    <h6>No upcoming orders </h6>
                </div>)
            } else {
                console.log(this.state.upcomingOrders);
                return(
                    <div>
                        <CheckValidBuyer/>
                         <BuyerNavbar/>
                         <Container>
                        <Card>YOUR ORDERS</Card>
                        {this.renderUpcomingOrders()}
                        </Container>
                    </div>
                );
            }
        }   
    }
}
export default BuyerUpcomingOrders;