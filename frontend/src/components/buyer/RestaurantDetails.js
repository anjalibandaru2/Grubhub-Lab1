import React,{ Component } from "react";
import {Card, Container, Col,  Row} from 'react-bootstrap';
import axios from 'axios';
import BuyerModal from "./BuyerModal.js";
import $ from 'jquery';

export class RestaurantDetails extends Component {
    state = {
        "isRendered" : false,
        "restaurantDetails" : "",
        "currentItem" : {}
    };
    constructor(props){
        super(props);
        this.state.isRendered = false;
        this.toggleModal = this.toggleModal.bind(this);
    }
     componentDidMount=async ()=>{
        console.log(this.props);
        await axios({
            method: 'post',
            url: "http://localhost:3001/getRestaurantDetails",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {"owner_id" : this.props.match.params.owner_id},
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
    }
     toggleModal =  async(item)=>{
        console.log("state set calledd...");
        console.log("before state set..")
        console.log(item);
        await this.setState({
            currentItem : item
        });
        console.log("after set state");
        console.log(this.state.currentItem);
        //$("#addCartModal").modal("toggle");
        window.$('#addCartModal').modal('show')
       // let addCartModal = document.getElementById("addCartModal");
        //addCartModal.modal("toggle");
    }
    displayMenuItems =(menuItems) =>{
        debugger;
        let renderMenuComponents = (menuList) =>{
            let menuComponents = [];
            for(let index =0; index < menuList.length; index++){
                menuComponents.push(
                    <Row key={index} data-toggle="modal" data-target="#addCartModal" onClick={()=>this.toggleModal(menuList[index])}>
                        <Card className="restaurant_item">
                        <Card.Body>
                            <Card.Title><h5>{menuList[index].item_name}</h5></Card.Title>
                            <img className="item_image" src={menuList[index].item_image}/>
                            {menuList[index].item_description}
                            {menuList[index].item_price}
                        </Card.Body>
                        </Card>
                    </Row>
                );
            }
            return menuComponents;
        }
        let allComponents = [];
       for(let menuType in menuItems){
           let menuList = menuItems[menuType];
           let menuComponents = renderMenuComponents(menuList);
           allComponents.push(<div key = {menuType}><h5>{menuType}</h5>{menuComponents} </div>);
       }
        
        return allComponents;
    }
    

    render(){
        let renderComponent = ()=>{
            debugger;
            if(!this.state.isRendered){
                return<div></div>;
            } else {
                return (
                    <div>
                        <div className="jumbotron restaurantDetails">
                        </div>
                        <Card>
                        <Card.Body>
                            <Card.Title><h5>{this.state.restaurantDetails[0].owner_restName}</h5></Card.Title>
                            <p>add image here</p>
                            {this.state.restaurantDetails[0].owner_restDescription}
                            {this.state.restaurantDetails[0].owner_restZipcode}
                        </Card.Body>
                        </Card>
                        <Card>
                        <Card.Body>
                            <Card.Title><h5>MENU</h5></Card.Title>
                        </Card.Body>
                        </Card>
                        <Container>
                            <Col xs={5}>
                            {this.displayMenuItems(this.state.restaurantDetails[0].menuItems)}
                            </Col>
                        </Container>
                    </div>
                );
            }
        }
        return (
            <div>
                 {renderComponent()}
                 <BuyerModal item={this.state.currentItem}></BuyerModal>
            </div>
        )
    }
}
export default RestaurantDetails;