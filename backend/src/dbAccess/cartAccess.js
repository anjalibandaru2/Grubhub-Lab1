const dbConnPool = require("./dbConnPool");

var addToCart =  async (itemDetails) =>{
    let conn;
    //let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            console.log("In add to cart... ");
            console.log(itemDetails);
            var insertedItem = await  conn.query('INSERT INTO cart SET ?', [itemDetails]);
            await conn.query("COMMIT");
            //console.log(insertedItem.itemId);
            //insertId = insertedItem.insertId;
            message = "Cart item is added successfully!!";
            console.log(message);
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Cart item is not added!!";
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

var getCart =  async (buyer_id) =>{
    let conn;
    //let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            let cartItems = await  conn.query('SELECT item_name, item_quantity, item_calculatedPrice FROM cart, menu WHERE buyer_id = ? AND cart.item_id = menu.item_id', [buyer_id]);
            await conn.query("COMMIT");
            //console.log(insertedItem.itemId);
            //insertId = insertedItem.insertId;
            message = cartItems;
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Cart item is not returned properly!!";
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

var deleteFromCart =  async (item_id) =>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var insertedItem = await  conn.query('DELETE FROM cart WHERE item_id =  ?', [item_id]);
            await conn.query("COMMIT");
            message = "Cart item is deleted successfully!!";
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Cart item is not deleted!!";
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
    addToCart : addToCart,
    getCart : getCart,
    deleteFromCart : deleteFromCart
}