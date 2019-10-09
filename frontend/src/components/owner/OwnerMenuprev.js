import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import './OwnerCss.css';
import axios from 'axios';
import cookie from "react-cookies";
import ModalDialog from "../ModalDialog.js";
import OwnerNavbar from "./OwnerNavbar";
import {getOwnerID, isFieldEmpty, CheckValidOwner} from "../genericapis.js";

class MenuType extends Component{
    state={
        "isMenuEmpty" : "",
        "itemType" : "",
        "itemsList" : ""
    };
    constructor(props){
        super(props);
        this.state.itemsList = this.props.itemsList;
        this.state.itemType = this.props.itemType;
        //|| (typeof this.state.itemsList !== undefined )&& this.state.itemsList.length <= 0
    }
    isMenuEmpty(){
        if(this.state.itemsList === null|| this.state.itemsList === "" || typeof this.state.itemsList === "undefined" ||(typeof this.state.itemsList !== "undefined" && this.state.itemsList.length <= 0) ){
            return true;
        } else{
            return false;
        }
    }
    displayMenuItems(){
        debugger;
        console.log("itemslist is...");
        console.log(this.props.itemsList);
        var children = [];
        var itemsList = this.props.itemsList;
        if(!this.isMenuEmpty()){
            itemsList.forEach((item)=>{
                console.log(item);
                let menuElement = <MenuItem key={item.item_id} item_id={item.item_id} item_image={item.item_image} itemName = {item.item_name} itemDescription={item.item_description} itemPrice={item.item_price} item_type={this.props.itemType} deleteItem={this.props.deleteItem}></MenuItem>;
                children.push(menuElement);
            });
            return(
               <Row>{children}</Row> 
            )
        } else {

            return (<div>No menu Items</div>);
        }
        
    }
    
    render(){
        let item_type = this.props.itemType; 
        var modalId = item_type + "modal";
        let owner_id = getOwnerID();
        let deleteAllBtn=()=>{
            if(this.isMenuEmpty()){
                return <div></div>
            } else{
                return (<button className="btn btn-danger" onClick={()=>{this.props.deleteAllItems(this.state.itemType)}}>Delete all items</button>)
            }
        }
        return(
            <Card>
                <Card.Body>
                    <Card.Title><h2 className="menu-title">{this.props.itemType}</h2></Card.Title>
                    {this.displayMenuItems()}
                    <ModalDialog id={modalId} btnName="Add" modalType="add" item_type={this.props.itemType} modalSubmitHandler={this.props.addItem}/>
                    {deleteAllBtn()}
                </Card.Body>
            </Card>
        )
    }
}

function MenuItem(props){
    //menu-content  media card col-xs-6 menuItem
    return(
        <div  className="media col-xs-6 menuItem">
                <div className="media-body">
                    <h5>{props.itemName}</h5>
                    <h6>Price : {props.itemPrice}</h6>
                    <p class="itemDescription">{props.itemDescription}</p>
                </div>
                <div className="media-right">
                <img className="item_image" src={props.item_image}/>
                </div>
                <button className="float-right">update</button>
                    <button className="float-right" onClick={()=>{props.deleteItem(props.item_id, props.itemType)}}>delete</button>
          </div>
    )
}

export class OwnerMenu extends Component{
    state = {
        allMenuItems : "",
        breakfast : [],
        lunch : [],
        appetizers : [],
        isREndered : false
    }
    constructor(props){
        super(props);
        //this.state.allMenuItems = "";
        this.state.breakfast = [];
        this.state.lunch = [];
        this.state.appetizers = [];
        this.state.isRendered = false;
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
    }
     componentDidMount(){
        axios.defaults.withCredentials = true;
        //var owner_id = cookie.load("user_id");
        let owner_id = getOwnerID();
        var data = {owner_id};
        axios.post("http://localhost:3001/getAllMenuItems", data).then((response)=>{
            console.log(response);
            //var allMenuItems = response.data.message;
            this.setState({
                breakfast : response.data.message["breakfast"],
                lunch : response.data.message["lunch"],
                appetizers : response.data.message["appetizers"],
                isRendered : true
            });
        });
    }
    updateItem(){
        var owner_id = cookie.load("user_id");
        var data = { owner_id};
        //pass item id as well
        axios.post("http://localhost:3001/updateItem", data).then((response)=>{
            console.log(response);
            //var allMenuItems = response.data.message;
            //this.setState({allMenuItems : response.data.message});
        });
    }
    addItem = async (addData, item_type)=>{
        debugger;
        console.log("in addItem..");
        let currentItems = this.state[item_type];
        currentItems.push(addData);
        this.setState({
            [item_type] : currentItems
        });
       /* axios.post("http://localhost:3001/addItem", data).then((response)=>{
            console.log(response);
        });*/

    }
    deleteItem(item_id, item_type){
        debugger;
        let owner_id = getOwnerID();
        var data = { owner_id, item_id};
        axios.post("http://localhost:3001/deleteItem", data).then((response)=>{
            console.log(response);
            if(response.status){
                alert("item deleted successfully!");
                debugger;
                let requiredItems = this.state[item_type]
                requiredItems = requiredItems.filter((item)=>{
                    if(item.item_id === item_id){
                        return false;
                    } else {
                        return true;
                    }
                });
                this.setState({
                    [item_type] : requiredItems
                })
            }else{
                alert("item cannot be deleted!");
            }
        });
    }
    deleteAllItems = async(item_type)=>{
        //axios request to delete all items
        debugger;
        let userSelection = window.confirm("Are you sure want to delete all "+ item_type +" items?");
        let owner_id = getOwnerID();
        if(userSelection){
            await axios({
                method: 'post',
                url: "http://localhost:3001/deleteAllItems",
                // data: {"jsonData" : JSON.stringify(data)},        
                data : {owner_id, item_type},
                headers: {'Content-Type': 'application/json'} 
                }).then((response) => {
                    if (response.status >= 500) {
                        throw new Error("Bad response from server");
                    }
                    return response.data;
                })
                .then((responseData) => {
                    //swal(responseData.responseMessage + " Try logging in.");
                   if(responseData.status){
                       var itemsList = [];
                       this.setState({
                          [item_type] : itemsList
                       });
                       
                   }else{
                        alert("Items cannot be deleted!!");
                   }
                }).catch(function (err) {
                    console.log(err);
                    //alert("Items cannot be deleted!!");
                });
        }
    }
    render(){
        if(!this.state.isRendered){
            
       /* if( this.state.breakfast.length === 0 && this.state.lunch.length === 0 && this.state.appetizers.length === 0){*/
            console.log("is empty breakfast lunch and dinner");
            return <div></div>
        } else {
            return(
                <div>
                    <CheckValidOwner/>
                    <OwnerNavbar></OwnerNavbar>
                    <Container>
                        <MenuType itemType="breakfast" itemsList = {this.state.breakfast} deleteAllItems={this.deleteAllItems} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem}></MenuType>
                        <MenuType itemType="lunch" itemsList = {this.state.lunch} deleteAllItems={this.deleteAllItems} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem}></MenuType>
                        <MenuType itemType="appetizers" itemsList = {this.state.appetizers} deleteAllItems={this.deleteAllItems} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem}></MenuType>
                        
                    </Container>
                </div>
                );
        }
    }
}
export default OwnerMenu;