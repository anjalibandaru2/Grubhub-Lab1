import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';

export class SignupBuyer extends Component{
    state = {
        submitHandler : "",
        displayMessage : ""
    }
    constructor(props){
        super(props);
        this.state.displayMessage = "";
        this.submitHandler = this.submitHandler.bind(this);
    }
    //backend="http://localhost:3001/signupbuyer";
    async submitHandler(evt){
        evt.preventDefault();
        console.log(evt.target);
        var formData = new FormData(evt.target);
        await axios({
            method: 'post',
            url: "http://localhost:3001/signupbuyer",
            // data: {"jsonData" : JSON.stringify(data)},        
            data: { "name": formData.get('name'), "email": formData.get('email'), "password": formData.get('password') },
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
                    });
                }
            }).catch(function (err) {
                console.log(err)
            });
    }
    render(){
        console.log("display message is..");
        console.log(this.state.displayMessage);
        return(
            <div>
            <div id="grubhubFixedTop" class="fixed-top text-light bg-dark"><h4>GRUBHUB</h4></div>
            <Container>
                <Row className="signup_signin_panel">
                    <Col xs={6} className="card signupsignin-card">
                        <h5 id="SignInText">Signup Buyer</h5>    
                            <hr/>
                        <form onSubmit={this.submitHandler} name="signupbuyer">
                            <div className="form-group">
                                <label className="control-label">Name</label>
                                <input type="text" name="name" required className="form-control" placeholder="Enter your Name"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Email</label>
                                <input type="email" name="email" required className="form-control" placeholder="Enter your Email"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label"> Password</label>
                                <input type="password" name="password" required className="form-control" placeholder=" Password"/>
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
export default SignupBuyer;