import React,{Component} from "react";
import {Card, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export class BuyerSearchResults extends Component{
    restaurant_Item=(restaurant, index)=>{
        let linkUrl = "/restaurant/"+restaurant.owner_id;
        return(
            <Link to={linkUrl} key={index} className="restaurantLink" restaurant={restaurant}>
                 <Card className="restaurant_item">
                 <Card.Body>
                    <Card.Title><h5>{restaurant.owner_restName}</h5></Card.Title>
                    {restaurant.owner_restDescription}
                    {restaurant.owner_restZipcode}
                </Card.Body>
                </Card>
            </Link>
        );
    }
    renderAllRestaurants=(restaurantsList)=>{
        debugger;
        if(typeof restaurantsList === "undefined" || restaurantsList.length === 0){
            return <h6>No items are present with the given item name</h6>
        } else if(typeof restaurantsList === "string"){
            return <h6>{restaurantsList}</h6>
        } else{
            let restaurantsArr = [];
            for(let index = 0; index < restaurantsList.length; index++){
                let markup = this.restaurant_Item(restaurantsList[index], index);
                restaurantsArr.push(markup);
            }
        /* restaurantsList.forEach(function(restaurant){
                let markup = this.restaurant_Item(restaurant);
                restaurantsArr.push(markup);
            });*/
           
            return (
                <div>
                <div>Restaurant details..</div>
                {restaurantsArr}
           </div>
            );
        }
    }
    /*renderCuisineList = ()=>{
        debugger;
        letfilterByCuisine = (evt) =>{
            
        }
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
    }*/

    render=()=>{
        return (
            <Container>
                {this.renderAllRestaurants(this.props.restaurantsList)}
            </Container>
        );
    }
}
export default BuyerSearchResults;