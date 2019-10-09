const dbConnPool = require("./dbConnPool");
const path = require("path");
const fs = require("fs");

var checkIfEmpty = (item) => {
    if(item === null || item === "" || typeof item === "undefined" || (  typeof item !== "undefined" && item.length == 0)){
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
var addSectionToMenu = async (owner_id, section_type) =>{
 //check if section is present already
 let conn;
 //let insertId = -1;
 let message = "";
 let status = false;
 try{
     conn = await dbConnPool.getConnection();
     if(conn){
         await conn.query("START TRANSACTION");
         var queryObj = await  conn.query('select * from sectionTypes where section_type = ?', [section_type]);
         console.log("queryObj..");
         console.log(queryObj);
         console.log("type is.."+typeof queryObj);
         console.log("type is.."+queryObj.length);
         if(checkIfEmpty(queryObj)){
             //add item
             let sectionData = {owner_id, section_type};
             var queryObj = await  conn.query('insert into sectionTypes set ?', [sectionData]);
             
             
             status = true;
             message = "Section is added successfully!";
         } else {
             // don't add item
             message = "Section already exists!!";
         }
         await conn.query("COMMIT");
         
     }
 }catch(e){
     console.log(e);
     message = "ERROR !! Menu item is not added!!";
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

var insertItem =  async (itemDetails) =>{
    let conn;
    //let insertId = -1;
    let message = "";
    let status = false;
    let returnItemDetails = "";
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var insertedItem = await  conn.query('INSERT INTO menu SET ?', [itemDetails]);
            await conn.query("COMMIT");
            console.log("inserted item is..")
            console.log(insertedItem);
            //insertId = insertedItem.insertId;
            message = "Menu item is added successfully!!";
            status = true;
            let item_id = insertedItem.insertId;
            console.log("item id is.."+item_id);
            if(item_id != -1){
                resultItems = await  conn.query('select * from  menu where item_id = ?', [item_id]);
                returnItemDetails = resultItems[0];
                console.log("returnItemDetails..")
                console.log(returnItemDetails["item_image"]);
                if(!checkIfEmpty(returnItemDetails["item_image"])){
                    console.log("in if..");
                    let imageName = getImageDirectory(returnItemDetails["item_image"]);
                    let base64str = base64Image(imageName);
                    returnItemDetails["item_image"] = "data:image/png;base64,"+base64str;
                }
            }
        }
    }catch(e){
        console.log(e);
        message = "Menu item is not added!!";
        status = false;
    }
    finally{
        if(conn){
            await conn.release();
            await conn.destroy();
        }
        return {
            status : status,
            message : message,
            itemDetails : returnItemDetails
        };
    }
}
let deleteSection = async(owner_id, section_id) =>{
    let conn;
    //let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var deletedItem = await  conn.query('DELETE FROM sectionTypes WHERE section_id = ? and owner_id=?', [section_id, owner_id]);
            deletedItem = await  conn.query('DELETE FROM menu WHERE section_id = ? and owner_id=?', [section_id, owner_id]);
            await conn.query("COMMIT");
            console.log(deletedItem);
            //insertId = insertedItem.insertId;
            message = "Menu items are deleted successfully!!";
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Menu items are not deleted!!";
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
var deleteItem =  async (item_id, owner_id) =>{
    let conn;
    //let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var deletedItem = await  conn.query('DELETE FROM menu WHERE item_id = ? and owner_id=?', [item_id, owner_id]);
            await conn.query("COMMIT");
            console.log(deletedItem);
            //insertId = insertedItem.insertId;
            message = "Menu item is deleted successfully!!";
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Menu item is not deleted!!";
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
    /* breakfast: [],
        lunch : [],
        appetizers : []*/
   /* var groupedItems={
        
    };
    for(var i=0; i<allItems.length; i++){
        console.log("item..");
        console.log(allItems[i]);
        let {section_type, item_image }= allItems[i];
        if(!checkIfEmpty(item_image)){
            let imageFileName =getImageDirectory(item_image);
            allItems[i]["item_image"]= "data:image/png;base64,"+base64Image(imageFileName);
        }
        section_type = section_type.toLowerCase();
        if(!(section_type in groupedItems)){
            groupedItems[section_type] = [];
        }
        groupedItems[section_type].push(allItems[i]);
    }
    return groupedItems;
};*/
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
var getAllMenuItems = async (owner_id)=>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            let queryObj = await conn.query('select section_id, section_type from sectionTypes where owner_id = ?',[owner_id]);
            //let allItemsObj = {};
            let allItemsArr = [];
            for(let i=0; i< queryObj.length; i++){
                let {section_type, section_id} = queryObj[i];
                var allMenuItems = await  conn.query('SELECT * FROM menu WHERE owner_id = ? and section_id = ?',[owner_id, section_id]);
                allMenuItems = resolveImages(allMenuItems);
                
                let obj = {};
                obj["section_type"] = section_type;
                obj["section_id"] = section_id;
                obj["menu_items"] = allMenuItems;
                //allItemsObj[section_type] = allMenuItems;
                allItemsArr.push(obj);
            }
            await conn.query("COMMIT");
            //insertId = insertedItem.insertId;
           // console.log("later allMenuItems...");
           // message = groupbyMenuItems(allMenuItems);
           message = allItemsArr;
           // console.log(message);
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "No items returned!!";
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

module.exports = { addSectionToMenu, insertItem, getAllMenuItems, deleteSection, deleteItem};