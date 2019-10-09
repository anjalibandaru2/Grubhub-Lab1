import React,{Component} from "react";
import OwnerNavbar from "./OwnerNavbar.js";
import {CheckValidOwner} from "../genericapis.js";
export class OwnerHome extends Component{
    render(){
        return(
                <div>
                    <CheckValidOwner/>
                    <OwnerNavbar></OwnerNavbar>
                </div>
        )
    }
}
export default OwnerHome;