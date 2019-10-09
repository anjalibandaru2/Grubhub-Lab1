import React,{Component} from "react";
import {Card, Container, Col,  Row} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID} from "../genericapis.js";

export class BuyerModal extends Component{
    state={
        item_quantity : 1,
        item_name :"",
        item_description :"",
        item_price : "",
        item_id : "",
        calculatedPrice : ""
    }
    constructor(props){
        super(props);
        console.log("in constructor of buyermodal");
        console.log(this.props);
        this.state.item_name = this.props.item.item_name;
        this.state.item_description = this.props.item.item_description;
        this.state.item_price = this.props.item.item_price;
        this.state.item_id = this.props.item.item_id;
        this.incrementQuantity = this.incrementQuantity.bind(this);
        this.decrementQuantity = this.decrementQuantity.bind(this);
        this.addItemToCart = this.addItemToCart.bind(this);
        this.calculatedPrice =  this.state.item_price;
         //  {this.state.item_name,this.state.item_description, this.state.item_price, this.state.item_id} = this.props;
    }
    static getDerivedStateFromProps(props, state) {
        console.log("in getDerivedStateFromProps" );
        console.log(state);
        console.log(props);
        if (props.item !== state.item) {
          return {
           ...state,
            item_name : props.item.item_name,
            item_description : props.item.item_description,
            item_price : props.item.item_price,
            item_id : props.item.item_id,
            calculatedPrice :  props.item.item_price
          };
        }
        // Return null to indicate no change to state.
        return null;
      }
     /* componentWillReceiveProps(newProps){
          console.log("in componentWillReceiveProps" );
          console.log(newProps);
          this.setState({item : newProps.item});
      }*/
      incrementQuantity=()=>{
        console.log("increment called..");
        let newQuantity  = this.state.item_quantity + 1;
        let calculatedPrice = newQuantity * this.state.item_price;
        this.setState({
            item_quantity : newQuantity,
            calculatedPrice : calculatedPrice
        });
    }
    decrementQuantity=()=>{
        let newQuantity  = this.state.item_quantity - 1;
        let calculatedPrice = newQuantity * this.state.item_price;
        this.setState({
            item_quantity : newQuantity,
            calculatedPrice : calculatedPrice
        })
    }
    renderQuantityComponent=()=>{
        return(
           <div> 
               <button onClick={this.decrementQuantity}>-</button>
               <span id="quantityValue">{this.state.item_quantity}</span>
               <button onClick={this.incrementQuantity}>+</button></div>
        )
    }
    addItemToCart=async ()=>{
        //axios req to server
        let buyer_id = getBuyerID();
        await axios({
            method: 'post',
            url: "http://localhost:3001/addToCart",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {"item_id" : this.state.item_id, buyer_id : buyer_id, item_calculatedPrice : this.state.calculatedPrice, item_quantity : this.state.item_quantity},
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
                    restaurantDetails : responseData.message
                });
                //this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
        window.$('#addCartModal').modal('hide');
    }
    render=()=>{
        var modalId = "addCartModal";
       // var btnTarget = "#" + modalId;
        return(
            <div>
            <div className="modal" id={modalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <div className="jumbotron buyerHomeComponent1 modal-header-element"></div>
                </div>
                <div className="modal-body">
                    <Container>
                        <Row><strong>{this.state.item_name}</strong></Row>
                        <Row><strong>{this.state.item_description}</strong></Row>
                        <Row><strong>{this.state.item_price}$</strong></Row>
                        <Row>Quantity&nbsp;&nbsp;{this.renderQuantityComponent()}</Row>
                    </Container>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick = {this.addItemToCart} data-dismiss="modal">Add to cart</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )
    }
}
export default BuyerModal;