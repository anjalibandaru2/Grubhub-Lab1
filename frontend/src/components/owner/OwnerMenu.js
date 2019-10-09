import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import './OwnerCss.css';
import axios from 'axios';
import cookie from "react-cookies";
import ModalDialog from "../ModalDialog.js";
import OwnerNavbar from "./OwnerNavbar";
import {getOwnerID, isFieldEmpty, CheckValidOwner} from "../genericapis.js";

class AddSectionTemplate extends Component{
    state={
        section_type : ""
    }
    constructor(props){
        super(props);
        this.state.section_type = "";
        this.changeHandler = this.changeHandler.bind(this);
    }
    changeHandler(evt){
        let value = evt.target.value;
        this.state.section_type = value;
    }
    addSectionToMenu = (evt)=>{
        evt.preventDefault();
        let data = {
            owner_id : getOwnerID(),
            section_type : this.state.section_type
         };
        axios.defaults.withCredentials = true;
        axios.post("http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/addSectionToMenu", data).then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then((responseData) => {
            console.log(responseData.message);
            if(responseData.status){
                alert("Menu item is added successfully!!");
                window.location.reload();
            } else {
                alert(responseData.message);
            }
        }).catch(function (err) {
            console.log(err)
        });
       // 
    }
    render(){
        return(
            <form id = "addSection" onSubmit={this.addSectionToMenu}>
            <Row>
                <Col xs={6}> <input type="text" className="form-control" placeholder="section name" onChange ={this.changeHandler}/>  </Col>
                <Col xs={6}> <button type="submit" className="btn btn-success">Add Section</button> </Col>
            </Row>
        </form>
        );
       
    }
}
function MenuItem(props){
    return(
        <div  className="media col-xs-6 menuItem">
                <div className="media-body">
                    <h5>{props.item_name}</h5>
                    <h6>Price : {props.item_price}</h6>
                    <p class="itemDescription">{props.item_description}</p>
                </div>
                <div className="media-right">
                <img className="item_image" src={props.item_image}/>
                </div>
          </div>
    )
}
class MenuType extends Component{
    state={
        section_type : "",
        menu_items : "",
        section_id : ""
    }
    constructor(props){
        super(props);
        this.state.section_type = this.props.section_type;
        this.state.menu_items = this.props.menu_items;
        this.state.section_id = this.props.section_id;
        //this.state.menuItemsObj = this.props.menuItemsObj;
    }
    displayMenuItems(){
        var children = [];
        let section_type = this.props.section_type;
        let menu_items = this.props.menu_items;
       // var menu_items =  this.state.menu_items;
       // if(!this.isMenuEmpty()){
            menu_items.forEach((item)=>{
                console.log(item);
                let menuElement = <MenuItem key={item.item_id} item_id={item.item_id} item_image={item.item_image} item_name = {item.item_name} item_description={item.item_description} item_price={item.item_price} section_type={section_type}></MenuItem>;
                children.push(menuElement);
            });
            return(
               <Row>{children}</Row> 
            )
        //} else {

          //  return (<div>No menu Items</div>);
       // }
        
    }
    deleteSection(section_id){
        axios.defaults.withCredentials = true;
        let data = {owner_id : getOwnerID(), section_id }
        axios.post("http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/deleteSection", data).then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then((responseData) => {
            console.log(responseData.message);
            if(responseData.status){
                alert("Menu item is deleted successfully!!");
                window.location.reload();
            } else {
                alert(responseData.message);
            }
        }).catch(function (err) {
            console.log(err)
        });
    }

    addItem(){

    }

    render(){
        /*<Col xs={2} className="float-right"><button className = "btn btn-success">Add items</button></Col>*/
        var modalId = this.props.section_type + "modal";
        return(
            <Card>
                <Card.Body>
                    <Card.Title><h2 className="menu-title">{this.state.section_type }</h2></Card.Title>
                    {this.displayMenuItems()}
                        
                        <Col xs={2} className="float-right">
                            <ModalDialog id={modalId} btnName="Add items" modalType="add" section_id={this.props.section_id} modalSubmitHandler={this.addItem}/>
                        </Col>

                        <Col xs={2} className="float-right"><button className = "btn btn-success">Update section</button></Col>
                        <Col xs={2} className="float-right"><button className = "btn btn-success" onClick={()=>{this.deleteSection(this.props.section_id)}}>Delete section</button></Col>
                </Card.Body>
            </Card>
        )
    }
}

class AllMenuItems extends Component{
    state={
        allMenuItems : {}
    }

    constructor(props){
        super(props);
        this.state.allMenuItems = this.props.allMenuItems;
    }
    componentWillReceiveProps(){
        
    }
    render=()=>{
        let menuItemsArr = [];
        let allMenuItems = this.props.allMenuItems;
        for(let index = 0; index < allMenuItems.length; index++){
            let menuItemsObj = allMenuItems[index];
            let {section_id, section_type, menu_items} = menuItemsObj;
            menuItemsArr.push(<MenuType key={index} section_type={section_type} section_id = {section_id} menu_items  = {menu_items}></MenuType>);
            
        }
       /* for(let key in allMenuItems){
            let menu_items = allMenuItems[key];
            menuItemsArr.push(<MenuType key={key} item_type={key} menu_items = {menu_items}></MenuType>);
        }*/
        return(
            menuItemsArr    
        );
    }
}

export class OwnerMenu extends Component{
    state={
        allMenuItems : [],
        isRendered : false
    }
    constructor(props){
        super(props);
        this.state.allMenuItems = [];
        this.state.isRendered = false;
    }
    componentDidMount(){
        //initialize allmenuitems
        debugger;
        axios.defaults.withCredentials = true;
        //var owner_id = cookie.load("user_id");
        let owner_id = getOwnerID();
        var data = {owner_id};
        axios.post("http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/getAllMenuItems", data).then((response) => {
            if (response.status >= 500) {
                throw new Error("Bad response from server");
            }
            return response.data;
        })
        .then((responseData) => {
            console.log(responseData);
            if(responseData.status){
                this.setState({
                    allMenuItems : responseData.message,
                     isRendered : true
                 });
            } else{
                alert(responseData.message);
            }
        }).catch(function (err) {
            console.log(err)
        });
    }

    render(){
        /* <AllMenuItems allMenuItems = {this.state.allMenuItems}/> */
      /*  if(!this.state.isRendered){
            return <div></div>;
        } else{*/
            return(
                <div>
                    <CheckValidOwner/>
                    <OwnerNavbar></OwnerNavbar>
                    <Container>
                        <AddSectionTemplate/>
                        <AllMenuItems allMenuItems = {this.state.allMenuItems}/> 
                    </Container>
                </div>
            );
        //}
        
    }
}
export default OwnerMenu;