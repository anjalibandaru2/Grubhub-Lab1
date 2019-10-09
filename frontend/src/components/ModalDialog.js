import React,{Component} from "react";
import {getOwnerID} from "./genericapis.js";
import axios from 'axios';

export class ModalDialog extends Component{
    state={
        item_name : "",
        item_description : "",
        item_price : "",
        section_id : "",
        modalId : ""
    }
    constructor(props){
        super(props);
        this.state.modalId = this.props.id;
        this.state.item_name = "";
        this.state.item_description = "";
        this.state.item_price = "";
        this.state.section_id = this.props.section_id;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitClickHandler = this.submitClickHandler.bind(this);
    }
    handleInputChange(evt){
        var name = evt.target.name;
        var value = evt.target.value;
        this.setState({
            [name] : value
        })
    }
    renderModalBody(){
        if(this.props.modalType === "add" || this.props.modalType === "update"){
            return(
                <form id={this.props.id} onSubmit={this.submitClickHandler} encType="multipart/form-data">
                    <div className="form-group">
                        <input type="text" required className="form-control" placeholder="Item Name" value={this.props.item_name} name="item_name" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <input type="text" required className="form-control" placeholder="Item Description" value={this.props.item_description} name="item_description" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <input type="number" required className="form-control" placeholder="Item Price" value={this.props.item_price} name="item_price" onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <input type='file' id='itemImage' name="item_image" accept="image/x-png,image/gif,image/jpeg"/>
                    </div>
                    <p>Item image upload</p>
                    
                    <div className="modal-footer">
                    <button type="submit" className="btn btn-success">Submit</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
                </form>
            )
        } else{
            return(
                <h5>Are you sure want to delte this item?</h5>
            )
        }
    }
    submitClickHandler=async(evt)=>{
        axios.defaults.withCredentials = true;
        let {item_name, item_description, item_price, section_id} =this.state;
        evt.preventDefault();
        let owner_id = getOwnerID();
        let form_data = new FormData();
        form_data.set('owner_id', owner_id);
        form_data.append('item_image', evt.target.elements["item_image"].files[0]);
        form_data.set('item_name',item_name);
        form_data.set("item_description", item_description);
        form_data.set('item_price',item_price);
        form_data.set("section_id", section_id);
        //this.props.modalSubmitHandler( form_data);
       // this.props.modalSubmitHandler( {item_name, item_description, item_price, section_id});
       let addData = {};
       await axios({
        method: 'post',
        url: "http://localhost:3001/addItem",
        // data: {"jsonData" : JSON.stringify(data)},        
        data : form_data,
        headers: {'Content-Type': 'multipart/form-data'} 
        }).then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then((responseData) => {
            //swal(responseData.responseMessage + " Try logging in.");
            console.log(responseData);
            if(responseData.status){
                
                addData = responseData.itemDetails;
                alert("item added successfully!!");
                window.location.reload();
            }
        }).catch(function (err) {
            console.log(err);
            alert("Please fill proper details! item not added !!");
        });
       // this.props.modalSubmitHandler(addData, section_id);
        window.$("#"+this.state.modalId).modal('hide');

    }
    render(){
        var modalId = this.props.id;
        var btnTarget = "#" + modalId;
        return(
            <div>
                <button type="button" className="btn btn-success float-right" data-toggle="modal" data-target={btnTarget}>
                    {this.props.btnName}
                </button>
            <div className="modal" id={modalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Add an Item</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                    Modal body..
                    {this.renderModalBody()}
                </div>
                
                </div>
            </div>
            </div>
        </div>
        )
    }
           
}

export default ModalDialog;