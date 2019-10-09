import React,{Component} from "react";
import {Card} from 'react-bootstrap';
import {Button, Container, Row, Col} from 'react-bootstrap';
import './OwnerCss.css';
import axios from 'axios';
import {getOwnerID, isFieldEmpty, CheckValidOwner} from "../genericapis.js";
import OwnerNavbar from "./OwnerNavbar.js";

class NonImageElement extends Component{
    state={
        element:"",
        value : "",
        editClicked : false,
        newValue : ""
    }
    constructor(props){
        super(props);
        this.state.element = this.props.element;
        this.state.value = this.props.value;
        this.state.newValue = this.props.value;
        this.state.editClicked = false;
        this.modifiedElement = this.modifiedElement.bind(this);
        this.modifiedValue = this.modifiedValue.bind(this);
        this.elementChangeHandler = this.elementChangeHandler.bind(this);
    }
    elementChangeHandler(evt){
        let value = evt.target.value;
        this.setState({
            newValue : value
        });
    }
    submitModalHandler = async (evt) =>{
        //axios request to server
        evt.preventDefault();
        axios.defaults.withCredentials = true;
        let owner_id = getOwnerID();
        let data = {
            owner_id,
            owner_colValue : this.state.newValue,
            owner_colName : this.state.element
        }
        await axios({
            method: 'post',
            url: "http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/updateOwnerProfile",
            // data: {"jsonData" : JSON.stringify(data)},        
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
                console.log(responseData.message);
                if(responseData.status){
                    this.setState({
                        editClicked : false,
                        value : responseData.message[this.state.element]
                    });
                } else {
                    //alert(responseData.message);
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
    cancelModalHandler = () => {
        //set editClicked to false
        this.setState({
            editClicked : false
        });
    }
    renderProfileModal(){
        if (this.state.editClicked){
            return(
                <Container>
                    <Col xs={4}>
                        <Row><h6>Update {this.modifiedElement(this.state.element)}</h6></Row>
                        <form onSubmit={this.submitModalHandler}>
                            <div className="form-group">
                                <input className="form-control" type="text" name={this.state.element} defaultValue={this.state.value} onChange = {this.elementChangeHandler}/>
                            </div>
                            <button className="btn btn-success" type="submit">Submit</button> &nbsp; &nbsp;
                            <button className="btn btn-success" onClick={this.cancelModalHandler}>Cancel</button>
                        </form>
                        <Row></Row>
                    </Col>
                </Container>
            );
        } else {
            return <div> {this.modifiedValue(this.state.value)} </div>
        }
    }
    modifiedValue = (value)=>{
        value = isFieldEmpty(value) ? "--" : value;
        return value;
    }
    modifiedElement=(element)=>{
        let elementsMap = {
            "owner_name" : "Name",
            "owner_email" : "Email",
            "owner_phoneNumber" : "Phone number",
            "owner_profileImage" : "Profile Image",
            "owner_address" : "Address",
            "owner_restName" : "Restaurant Name",
            "owner_restZipcode" : "Restaurant Zipcode",
            "owner_restCuisine" : "Restaurant Cuisine",
            "owner_restImage" : "Restaurant Image"
        }
        return elementsMap[element];
    }
    render(){
        //key={this.modifiedElement(this.state.element)}
        return(
            <Card className="row profileElement">
            <Card.Body><h6>{this.modifiedElement(this.state.element)}</h6></Card.Body>
            <Card.Body>
                {this.renderProfileModal()}
                <div className="float-right"><a href="#editOwnerProfile" onClick={()=>{this.setState({ editClicked : true })} }>Edit</a></div>
            </Card.Body>
        </Card>
        );
    }
}
class ProfileImage extends Component{
    state={
        element : "",
        value : "",
        editClicked : false,
        newValue : ""
    }
    constructor(props){
        super(props);
        this.state.element = this.props.element;
        this.state.value = this.props.value;
        this.state.newValue = this.props.value;
        this.state.editClicked = false;
    }
    /*elementChangeHandler(evt){
        let value = evt.target.value;
        this.setState({
            newValue : value
        });
    }*/
    submitModalHandler = async (evt) =>{
        //axios request to server
        evt.preventDefault();
        axios.defaults.withCredentials = true;
        let owner_id = getOwnerID();
        let data = new FormData();
        data.append('owner_id', owner_id);
        data.append('selectedFile', evt.target.elements[this.state.element].files[0]);
        data.append('owner_colName',this.state.element);
        //form.elements["buyer_profileImage"].files;
        console.log(evt.target.elements[this.state.element].files[0]);
        await axios({
            method: 'post',
            url: "http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/updateOwnerImage",
            // data: {"jsonData" : JSON.stringify(data)},        
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
                console.log(responseData.message);
                if(responseData.status){
                    this.setState({
                        editClicked : false,
                        value : responseData.message[this.state.element]
                    });
                } else {
                    alert(responseData.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
    }
    cancelModalHandler = () => {
        //set editClicked to false
        this.setState({
            editClicked : false
        });
    }
    renderProfileImageOverlay(){
        if (this.state.editClicked){
            return(
                <Container>
                    <Col xs={4}>
                        <Row><h6>Update {this.elementsMap[this.state.element]}</h6></Row>
                        <form onSubmit={this.submitModalHandler} encType="multipart/form-data">
                            <div className="form-group">
                                <input type='file' id='single' name={this.state.element} accept="image/x-png,image/gif,image/jpeg"/>
                            </div>
                            <button className="btn btn-success" type="submit">Submit</button> &nbsp; &nbsp;
                            <button className="btn btn-success" onClick={this.cancelModalHandler}>Cancel</button>
                        </form>
                    </Col>
                </Container>
            );
        } else {
            let eleValue = "--";
            if(isFieldEmpty(this.state.value)){
                eleValue = "--";
            } else {
                eleValue = <img src={this.state.value} alt="Profile Image"/>
            }
            return <div> {eleValue} </div>
        }
    }
    elementsMap = {
        "owner_profileImage" :"Profile picture",
        "owner_restImage" : "Restaurant Image"
    }
    render(){
        //key={this.modifiedElement(this.state.element)}
        
        return(
            <Card className="row profileElement">
            <Card.Body><h6>{this.elementsMap[this.state.element]}</h6></Card.Body>
            <Card.Body>
                {this.renderProfileImageOverlay()}
                <div className="float-right"><a href="#editOwnerProfile" onClick={()=>{this.setState({ editClicked : true })} }>Edit</a></div>
            </Card.Body>
        </Card>
        );
    }
}
export class OwnerProfile extends Component{
    state={
        isRendered : false,
        ownerProfile : {}
    }
    constructor(props){
        super(props);
        this.state.ownerProfile = {};
       // this.updateProfileModal = this.updateProfileModal.bind(this);
    }
    componentDidMount=async()=>{
        axios.defaults.withCredentials = true;
        let owner_id = getOwnerID();
        let data ={
            owner_id 
        }
        await axios({
            method: 'post',
            url: "http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/getOwnerProfile",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: {owner_id },
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                if (response.status >= 500) {
                    throw new Error("Bad response from server");
                }
                return response.data;
            })
            .then((responseData) => {
                console.log(responseData.message);
                if(responseData.status){
                    this.setState({
                        isRendered : true,
                        ownerProfile : responseData.message
                    });
                } else {
                    alert(responseData.message);
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
    
    render(){
        let renderProfileElements=()=>{
            let allEles= [];
            for(let element in  this.state.ownerProfile){
                let value = this.state.ownerProfile[element];
                //allCards.push(this.renderCardComponent(element, value));
                if(element != "owner_profileImage" && element != "owner_restImage"){
                    allEles.push(<NonImageElement key={element} element={element} value={value}/>);
                }
            }
            allEles.push( <ProfileImage key="owner_profileImage" element="owner_profileImage" value={this.state.ownerProfile.owner_profileImage}/>);
            allEles.push( <ProfileImage key="owner_restImage" element="owner_restImage" value={this.state.ownerProfile.owner_restImage}/>);
            return allEles;
        }

        let renderProfile = () => {
            if(!this.state.isRendered){
                return <div></div>
            } else{
                return (
                    renderProfileElements()
                );
            }
        }
        return(
            <div>
            <CheckValidOwner/>
            <OwnerNavbar/>
            <Container>
                <Col xs={9} className="offset-xs-2">
                {renderProfile()}
                </Col>
            </Container>
            </div>
        );
    }
}
export default OwnerProfile;