import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import SignIn from './components/SignIn.js';
import SignupBuyer from './components/SignupBuyer.js';
import SignupOwner from './components/SignupOwner.js';
import GrubhubHome from './components/GrubhubHome.js';
import {OwnerHome} from './components/owner/OwnerHome';
import {BuyerHome} from './components/buyer/BuyerHome';
import {BuyerProfile} from './components/buyer/BuyerProfile';
import {OwnerProfile} from './components/owner/OwnerProfile';
import {OwnerMenu} from './components/owner/OwnerMenu';
import {RestaurantDetails} from "./components/buyer/RestaurantDetails";
import {BuyerUpcomingOrders} from "./components/buyer/BuyerUpcomingOrders";
import {BuyerPastOrders} from "./components/buyer/BuyerPastOrders";
import {OwnerUpcomingOrders} from "./components/owner/OwnerUpcomingOrders";
import {OwnerPastOrders} from "./components/owner/OwnerPastOrders";
import {Cart} from "./components/buyer/Cart";

//Create a Main Component
export class Main extends Component {
    render(){
        console.log("react version...");
        console.log(React.version);
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={GrubhubHome}/>
                <Route path="/signin" component={SignIn}/>
                <Route path="/signupbuyer" component={SignupBuyer}/>
                <Route path="/signupowner" component={SignupOwner}/>
                <Route path="/buyerProfile" component={BuyerProfile}/>
                <Route path="/ownerProfile" component={OwnerProfile}/>
                <Route path="/owner/ownerHome" component={OwnerHome}/>
                <Route path="/owner/menu" component={OwnerMenu}/>
                <Route path="/buyer/buyerHome" component={BuyerHome}/>
                <Route path="/restaurant/:owner_id"  component={RestaurantDetails}/>
                <Route path = "/cart" component={Cart}/>
                <Route path = "/buyerUpcomingOrders" component={BuyerUpcomingOrders}/>
                <Route path = "/buyerPastOrders" component={BuyerPastOrders}/>
                <Route path = "/ownerUpcomingOrders" component={OwnerUpcomingOrders}/>
                <Route path = "/ownerPastOrders" component={OwnerPastOrders}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;
