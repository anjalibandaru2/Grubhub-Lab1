const dbConnPool = require("./dbConnPool");

var getBuyerProfile =  async (buyer_id) =>{
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
            //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
            var buyer_details =await  conn.query('SELECT buyer_name, buyer_email, buyer_phoneNumber, buyer_profileImage, buyer_address FROM buyer_details where buyer_id=? ', [buyer_id]);
            await conn.query("COMMIT");
            console.log(buyer_details[0]);
            message = buyer_details[0];
            console.log(message);
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Error at server side! Please login again to continue!!";
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

var updateBuyerProfile = async (buyer_id, buyer_colName, buyer_colValue) =>{
    //{buyer_id, buyer_colName, buyer_colValue}
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
            //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
            var buyer_details =await  conn.query('UPDATE buyer_details SET '+ buyer_colName +' = ? where buyer_id=? ', [buyer_colValue, buyer_id]);
            await conn.query("COMMIT");
            message = {[buyer_colName] : buyer_colValue};
            status = true;
            console.log(message);
        }
    }catch(e){
        console.log(e);
        message = "Error at server side! Please login again to continue!!";
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

let updateBuyerProfileImage = async (buyer_id, buyer_profileImageName)=>{
     //{buyer_id, buyer_colName, buyer_colValue}
     let conn;
     let insertId = -1;
     let message = "";
     let status = false;
     try{
         conn = await dbConnPool.getConnection();
         if(conn){
             await conn.query("START TRANSACTION");
             //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
             //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
             var buyer_details =await  conn.query('UPDATE buyer_details SET buyer_profileImage  = ? where buyer_id=? ', [buyer_profileImageName, buyer_id]);
             await conn.query("COMMIT");
             console.log(buyer_details[0]);
             message = {buyer_profileImage : buyer_profileImageName};
             status = true;
         }
     }catch(e){
         console.log(e);
         message = "Error at server side! Please login again to continue!!";
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

var getOwnerProfile =  async (owner_id) =>{
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
            //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
            var owner_details =await  conn.query('SELECT * FROM owner_details where owner_id=? ', [owner_id]);
            await conn.query("COMMIT");
           
            let ownerObj = owner_details[0];
            delete ownerObj.owner_password;
            delete ownerObj.owner_id;
            console.log(ownerObj);
            message = ownerObj;
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Error at server side! Please login again to continue!!";
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

var updateOwnerProfile = async (owner_id, owner_colName, owner_colValue) =>{
    //{owner_id, owner_colName, owner_colValue}
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
            //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
            var owner_details =await  conn.query('UPDATE owner_details SET '+ owner_colName +' = ? where owner_id=? ', [owner_colValue, owner_id]);
            await conn.query("COMMIT");
            console.log(owner_details[0]);
            message = {[owner_colName] : owner_colValue};
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Error at server side! Please login again to continue!!";
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

/*let updateOwnerImage = async (owner_id, buyer_profileImageName)=>{
    //{owner_id, buyer_colName, buyer_colValue}
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //TO BE CHANGED!!!!! TO SUPPORT CUISINE AND REST IMAGE
            //var restaurantsList =await  conn.query('SELECT owner_restName, owner_restZipcode FROM owner_details, menu where owner_details.owner_id = menu.owner_id and (menu.item_name=? or owner_details.rest_cuisine=?)', [itemOrCuisine, itemOrCuisine]);
            var buyer_details =await  conn.query('UPDATE buyer_details SET buyer_profileImage  = ? where owner_id=? ', [buyer_profileImageName, owner_id]);
            await conn.query("COMMIT");
            console.log(buyer_details[0]);
            message = {buyer_profileImage : buyer_profileImageName};
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Error at server side! Please login again to continue!!";
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
}*/

module.exports = {
    getBuyerProfile,
    updateBuyerProfile ,
    updateBuyerProfileImage ,
    getOwnerProfile,
    updateOwnerProfile,

}