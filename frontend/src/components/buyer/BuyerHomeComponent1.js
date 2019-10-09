import React,{ Component } from "react";
import {isFieldEmpty, getBuyerID} from "../genericapis.js";
import {Jumbotron, Container, Image, InputGroup, FormControl, Button, Row, Col} from 'react-bootstrap'
import "./buyerHome.css"
import axios from 'axios';

export class BuyerHomeComponent1 extends Component {
    state={
        itemOrCuisine : "",
        cuisineList : ""
    }
    constructor(props){
        super(props);
        this.itemOrCuisine = "";
        this.state.cuisineList = "";
        this.changeHandler = this.changeHandler.bind(this);
        this.filterRestaurants = this.filterRestaurants.bind(this);
    }
    changeHandler(evt){
        let itemOrCuisine = evt.target.value;
        this.setState({
            itemOrCuisine : itemOrCuisine
        });
    }
    /*componentDidMount(){
        this.getCuisineList();
    }*/
    async filterRestaurants(){
        var itemOrCuisine =  this.state.itemOrCuisine;
        axios.defaults.withCredentials = true;
        await axios({
            method: 'post',
            url: "http://localhost:3001/filterRestaurants",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {"itemOrCuisine" : this.state.itemOrCuisine},
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
                //console.log(cookie.load('cookie1'));
                this.props.searchHandler(responseData.message);
            }).catch(function (err) {
                console.log(err)
            });
    }
    getCuisineList= async()=>{
        var itemOrCuisine =  this.state.itemOrCuisine;
        axios.defaults.withCredentials = true;
        let buyer_id = getBuyerID();
        await axios({
            method: 'post',
            url: "http://localhost:3001/getCuisineList",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {buyer_id : buyer_id},
            config: { headers: { 'Content-Type': 'application/json' } }
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
                //console.log(cookie.load('cookie1'));
                if(responseData.status){
                   this.setState({
                        cuisineList : responseData.message
                   });
                } else{
                    alert(responseData.message);
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
    /*renderCuisineList = ()=>{
        debugger;
        if(isFieldEmpty(this.state.cuisineList)){
            return <div></div>;
        } else{
            let cuisineList = this.state.cuisineList;
            let allCuisineArr = [];
            for(let i=0; i<cuisineList.length; i++){
                let cuisine = cuisineList[i]["owner_restCuisine"];
                allCuisineArr.push(<option key={i} onChange={filterByCuisine}>{cuisine}</option>);
            }
            return (
                <div>
                    <select>
                    {allCuisineArr}
                    </select>
                </div>
            );
        }
    }
    <Row>
                    <Col xs={6}>
                        <h5>Filter by cuisine</h5>
                        {this.renderCuisineList()}
                    </Col>
                </Row>*/
    render(){
        
        return(
            <div className="jumbotron buyerHomeComponent1">
            <Container>
                <Row>
                    <Col xs={6}>
                    <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <i id="search_restaurant" className="fas fa-search"></i>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter food, cuisine"
                            onChange={this.changeHandler}
                            name="itemOrCuisine"
                        />
                    </InputGroup>
                    </Col>
                    <Col xs={2}>
                    <Button variant="primary" onClick={this.filterRestaurants}>Find food</Button>
                    </Col>
                </Row>
                
            </Container>
        </div>
        );
    }

}