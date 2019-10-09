import React,{Component} from "react";
import BuyerNavbar from "./BuyerNavbar.js";
import {CheckValidBuyer} from "../genericapis.js";
import {BuyerHomeComponent1} from "./BuyerHomeComponent1.js";
import {BuyerHomeComponent2} from "./BuyerHomeComponent2.js";
import {BuyerSearchResults} from "./BuyerSearchResults.js";

export class BuyerHome extends Component{
    state={
        "newsearch" : true,
        "restaurantsList" :"",
    }
    constructor(props){
        super(props);
        this.state.newsearch = true;
        this.state.restaurantsList = "";
        this.searchHandler = this.searchHandler.bind(this);
    }
   /* filterByCuisine(){
        let dropdownChangeHandler = (evt)=>{
            let changedValue = evt.target.value;
            let newRestList = this.state.restaurantsList.filter((restaurant)=>{
                if(restaurant.owner_restCusine  === changedValue){
                    return true;
                } else {
                    return false;
                }
            });
            return newRestList;
        };
    }*/
    searchHandler(restaurantsList){
        this.setState({
            restaurantsList,
            newsearch : false
        });
    }
    render(){
        let renderComponent = <BuyerHomeComponent2></BuyerHomeComponent2>
        console.log("new search state value is.."+this.state.newsearch)
        if(!this.state.newsearch){
            console.log("in if..");
             renderComponent = <BuyerSearchResults restaurantsList = {this.state.restaurantsList}></BuyerSearchResults>
             
        }
        return(
                <div>
                    <CheckValidBuyer/>
                    <BuyerNavbar></BuyerNavbar>
                    <BuyerHomeComponent1 searchHandler={this.searchHandler}></BuyerHomeComponent1>
                    {renderComponent}
                </div>
        )
    }
}
export default BuyerHome;