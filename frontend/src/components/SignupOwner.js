import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';

export class SignupOwner extends Component{
    state = {
        submitHandler : "",
        displayMessage : ""
    }
    constructor(props){
        super(props);
        this.state.displayMessage = "";
        this.submitHandler = this.submitHandler.bind(this);
    }
    //backend="http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/signupowner";
    async submitHandler(evt){
        evt.preventDefault();
        console.log(evt.target);
        var formData = new FormData(evt.target);
        await axios({
            method: 'post',
            url: "http://ec2-54-147-235-117.compute-1.amazonaws.com:3001/signupowner",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: { "name": formData.get('name'), "email": formData.get('email'), "password": formData.get('password'), "restName" : formData.get('restName'), "restZipcode" : formData.get('restZipCode')},
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
                let showDisplayMessage=(message)=>{
                    return(
                        <div className = "form-group">
                                <label>{message} Click <a href="/signin">here</a> to login</label>
                            </div>
                    );
                }
                if(responseData.status){
                    this.setState({
                        displayMessage : showDisplayMessage(responseData.message),
                        redirect: true
                    });
                } else{
                    this.setState({
                        displayMessage : responseData.message,
                         redirect: true
                    })
                   // alert(responseData.message);
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
    render(){
        return(
            <div>
            <div id="grubhubFixedTop" class="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6}  className="card signupsignin-card">
                        <h5 id="SignInText">Signup Owner</h5>    
                            <hr/>
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" required name="name" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" required name="email" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Password</label>
                                <input type="password" required name="password" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant name</label>
                                <input type="text" required name="restName" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Restaurant zipcode</label>
                                <input type="number" required name="restZipCode" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success">Submit</button>
                            </div>
                            {this.state.displayMessage}
                        </form>
                    </Col>
                </Row>
            </Container>
            </div>
        );
    }
}
export default SignupOwner;