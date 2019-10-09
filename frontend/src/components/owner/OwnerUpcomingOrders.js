import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {getOwnerID, CheckValidOwner} from "../genericapis.js";
import UpdateOrderModal from "./UpdateOrderModal.js";
import OwnerNavbar from "./OwnerNavbar.js";

export class OwnerUpcomingOrders extends Component {
    state={
        isRendered : false,
        upcomingOrders : [],
        message : "",
        currentOrder : {}
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.state.upcomingOrders = [];
        this.toggleModal = this.toggleModal.bind(this);
    }
    componentDidMount = async()=>{
        axios.defaults.withCredentials = true;
        let owner_id = getOwnerID();
        let data ={
            owner_id 
        }
        await axios({
            method: 'post',
            url: "http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/ownerUpcomingOrders",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {owner_id : owner_id},
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
                        isRendered : true,
                        upcomingOrders : responseData.message.orders
                    });
                } else {
                    this.setState({
                        isRendered : true,
                        message : responseData.message
                    });
                }
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
    }
    toggleModal =  async(order)=>{
        console.log("state set calledd...");
        console.log("before state set..")
        console.log(order);
        await this.setState({
            currentOrder : order
        });
        console.log("after set state");
        console.log(this.state.currentOrder);
        //$("#addCartModal").modal("toggle");
        window.$('#updateStatusModal').modal('show');
       // let addCartModal = document.getElementById("addCartModal");
        //addCartModal.modal("toggle");
    }
    cancelOrder = async(order_id) =>{
         //axios req to server
         let data = {
             "order_id" : order_id, 
             order_status : "cancelled"
         }
         await axios({
             method: 'post',
             url: "http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/updateOrderStatus",        
             data,
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
                 alert(responseData.message);
                 //window.location.reload();
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
        let renderEachOrder = (order,index)=>{
            return (
                <Card key={index}>
                    <Card.Body>
                        <Card.Title>
                            <h5 >Name : {order.buyer_name}</h5>
                            <h5> Address : {order.buyer_address}</h5>
                        </Card.Title>
                       <h6>Order status : {order.order_status}</h6>
                       <Row>
                           <Col> <h6>Total Price : {order.totalPrice}</h6> </Col>
                        </Row>
                       {renderItemsInOrder(order.items)}
                       <Row>
                            <Col xs={2} className="offset-md-8"><button className="btn btn-success" onClick={()=>this.toggleModal(order)}>Update Order</button></Col>
                            <Col xs={2}><button className="btn btn-success" onClick={()=>{this.cancelOrder(order.order_id)}}>Cancel Order</button></Col>
                        </Row>
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
            if( this.state.upcomingOrders.length == 0){
                if(this.state.message){
                    return <div>{this.state.message}</div>
                } else{
                    return <div>No upcoming orders</div>
                }
            } else {
                console.log(this.state.upcomingOrders);
                return(
                    <div>
                        <OwnerNavbar/>
                        <CheckValidOwner/>
                        <Container>
                        <Card>YOUR UPCOMING ORDERS</Card>
                        {this.renderUpcomingOrders()}
                        <UpdateOrderModal order={this.state.currentOrder}></UpdateOrderModal>
                        </Container>
                    </div>
                );
            }
        }   
    }
}
export default OwnerUpcomingOrders;