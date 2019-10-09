import React,{Component} from "react";
import {Card, Container, Col,  Row, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import {getBuyerID} from "../genericapis.js";

export class UpdateOrderModal extends Component{
    state={
        order_id : "",
        order_status : "",
        new_status : ""
    }
    constructor(props){
        super(props);
        console.log("in constructor of buyermodal");
        console.log(this.props);
        this.state.order_id = this.props.order.order_id;
        this.state.order_status = this.props.order.order_status;
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
         //  {this.state.item_name,this.state.item_description, this.state.item_price, this.state.item_id} = this.props;
    }

    static getDerivedStateFromProps(props, state) {
        console.log("in getDerivedStateFromProps" );
        console.log(state);
        console.log(props);
        if (props.order !== state.order) {
          return {
            order_id : props.order.order_id,
            order_status : props.order.order_status
          };
        }
        // Return null to indicate no change to state.
        return null;
      }

    updateOrderStatus=async ()=>{
        //axios req to server
        let new_status = this.state.new_status == "" ? this.state.order_status : this.state.new_status;
        let data ={
            "order_id" : this.state.order_id, 
            order_status : this.state.new_status
        }
        await axios({
            method: 'post',
            url: "http://localhost:3001/updateOrderStatus",        
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
            }).catch(function (err) {
                console.log(err)
            });
        window.$('#updateStatusModal').modal('hide');
    }
     changeHandler(evt){
        let target = evt.target;
        let name = target.name;
        let value1 = target.value;
        console.log("state before...");
        console.log(this.state);
          this.setState({
            new_status : value1
        },()=>{
            console.log(this.state.new_status);
        });
    }
    render=()=>{
        var modalId = "updateStatusModal";
       // var btnTarget = "#" + modalId;
       console.log(" order id is {this.state.order_id} and status is {this.state.order_status}");
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
                    <Card>
                        <Card.Title> Update order status </Card.Title>
                        <form onChange = {this.changeHandler}>
                            <select name="order_status">
                                <option value="new">New</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </form>
                    </Card>
                    </Container>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick = {this.updateOrderStatus} data-dismiss="modal">Update</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )
    }
}
export default UpdateOrderModal;