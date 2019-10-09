const dbConnPool = require("./dbConnPool");
const path = require("path");
const fs = require("fs");


var checkIfEmpty = (item) => {
    if(item === null || item === "" || typeof item === "undefined"){
        return true;
    } else{
        return false;
    }
}
let base64Image = (buyer_profileImageName) =>{
    var bitmap = fs.readFileSync(buyer_profileImageName);
    return new Buffer(bitmap).toString('base64');
}
let getImageDirectory=(buyer_profieImageName)=>{
    let pathName = path.join(__dirname, '../../uploads/menuItems', buyer_profieImageName);
    return pathName;
}
var resolveImages = (allMenuItems) =>{
    for(let i=0; i<allMenuItems.length; i++){
        let {item_image }= allMenuItems[i];
        if(!checkIfEmpty(item_image)){
            let imageFileName =getImageDirectory(item_image);
            allMenuItems[i]["item_image"]= "data:image/png;base64,"+base64Image(imageFileName);
        }
    }
    return allMenuItems;
}

var getCuisineList = async()=>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var cuisineList =await  conn.query('SELECT owner_restCuisine FROM  owner_details');
            await conn.query("COMMIT");
            message = cuisineList;
            status = true;
            console.log(message);
        }
    }catch(e){
        console.log(e);
        message = "Cannot fetch cuisine list!!";
        status = false;
    }
    finally{
        if(conn){
            await conn.release();
            await conn.destroy();
        }
        return {
            status : status,
            message : message
        };
    }
}
var filterRestaurants =  async (itemOrCuisine) =>{
    let addCusineAndItemFilterResults=(restaurantsList, restListWithCuisine)=>{
        let uniqueRestNames = {};
        let uniqueRestList = [];
        let newObj;
        for(let i=0; i< restaurantsList.length;i++){
            let restName = restaurantsList[i].owner_restName;
            if(restName in uniqueRestNames){
                continue;
            } else{
                uniqueRestNames["restName"] = 1;
                uniqueRestList.push(restaurantsList[i]);
            }
        }
        for(let i=0; i< restListWithCuisine.length;i++){
            let restName = restListWithCuisine[i].owner_restName;
            if(restName in uniqueRestNames){
                continue;
            } else{
                uniqueRestNames["restName"] = 1;
                uniqueRestList.push(restListWithCuisine[i]);
            }
        }
        return uniqueRestList;
    }
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    let item = itemOrCuisine;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
            //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
            var restaurantsList =await  conn.query('SELECT owner_details.owner_id, owner_restName, owner_restCuisine, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and menu.item_name=? ', [itemOrCuisine]);

            var queryObj =await  conn.query('SELECT owner_id FROM menu where item_name = ? ', [itemOrCuisine]);
            let owner_id = queryObj[0]["owner_id"];
            var restaurantsList =await  conn.query('SELECT owner_id, owner_restName, owner_restCuisine, owner_restZipcode FROM owner_details where owner_id = ? ', [owner_id]);
           


           // let restListWithCuisine = await  conn.query('SELECT owner_details.owner_id, owner_restName, owner_restZipcode FROM owner_details where owner_details.owner_restCuisine=? ', [itemOrCuisine]);
            await conn.query("COMMIT");
            //console.log(restaurantsList + restaurantsList.length);
            console.log("restaurant list..");
            console.log(restaurantsList);
           /* console.log("restaurant  list with given cuisine....");
            console.log(restListWithCuisine);
            if(restaurantsList.length >0 && restListWithCuisine.length>0){
                let finalRestList = addCusineAndItemFilterResults(restaurantsList,restListWithCuisine);
                message = finalRestList;
            } else if(restaurantsList.length >0){
                message = restaurantsList;
            } else if(restListWithCuisine.length >0){
                message = restListWithCuisine;
            }*/
            message = restaurantsList;
            status = true;
            if(typeof message === "undefined" || message.length == 0 ){
                message = "No items found ";
            }
            console.log(message);
        }
    }catch(e){
        console.log(e);
        message = "ERROR !!Invalid search results!!";
        status = false;
    }
    finally{
        if(conn){
            await conn.release();
            await conn.destroy();
        }
        return {
            status : status,
            message : message
        };
    }
}
/*var groupbyMenuItems = (allItems) =>{
    var groupedItems={
        breakfast: [],
        lunch : [],
        appetizers : []
    };
    for(var i=0; i<allItems.length; i++){
        console.log("item..");
        console.log(allItems[i]);
        let {item_type, item_image }= allItems[i];
        if(!checkIfEmpty(item_image)){
            let imageFileName =getImageDirectory(item_image);
            allItems[i]["item_image"]= "data:image/png;base64,"+base64Image(imageFileName);
        }
        item_type = item_type.toLowerCase();
        if(!(item_type in groupedItems)){
            groupedItems[item_type] = [];
        }
        groupedItems[item_type].push(allItems[i]);
    }
    return groupedItems;
};*/

var getRestaurantDetails =  async (owner_id) =>{
    let getMenuWithImages = (getMenuWithImages) =>{

    }
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var restaurantOwnerDetails = await  conn.query('SELECT * FROM  owner_details where owner_id= ?', [owner_id]);

            let queryObj = await conn.query('select section_id, section_type from sectionTypes where owner_id = ?',[owner_id]);
            //let allItemsObj = {};
            let allItemsArr = [];
            for(let i=0; i< queryObj.length; i++){
                let {section_type, section_id} = queryObj[i];
                var allMenuItems = await  conn.query('SELECT * FROM menu WHERE owner_id = ? and section_id = ?',[owner_id, section_id]);
                allMenuItems = resolveImages(allMenuItems);
                
               /* let obj = {};
                obj["section_type"] = section_type;
                obj["section_id"] = section_id;
                obj["menu_items"] = allMenuItems;
                //allItemsObj[section_type] = allMenuItems;
                allItemsArr.push(obj);*/
                allItemsArr.push(allMenuItems);
            }


          //  var restaurantMenuList =await  conn.query('SELECT * FROM  menu WHERE menu.owner_id = ?', [owner_id]);
            await conn.query("COMMIT");
            //restaurantMenuList = groupbyMenuItems(restaurantMenuList);
            //restaurantOwnerDetails[0]["menuItems"] = restaurantMenuList;
            //message = restaurantOwnerDetails;
            
            restaurantOwnerDetails[0]["menuItems"] = allItemsArr;
            message = restaurantOwnerDetails;
            status = true;
            console.log(message);
        }
    }catch(e){
        console.log(e);
        message = "Cannot fetch restaurant menu list!!";
        status = false;
    }
    finally{
        if(conn){
            await conn.release();
            await conn.destroy();
        }
        return {
            status : status,
            message : message
        };
    }
}

module.exports = {
    filterRestaurants : filterRestaurants,
    getRestaurantDetails : getRestaurantDetails,
    getCuisineList
}