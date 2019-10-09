const dbConnPool = require("./dbConnPool");

var placeOrder =  async (buyer_id, totalPrice) =>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            let cartItems = await conn.query('select item_id, item_quantity, item_calculatedPrice from cart where buyer_id=?',[buyer_id]);
            console.log(cartItems);
            let item_id = cartItems[0].item_id;
            var queryObj = await conn.query('select owner_id from menu where item_id = ?',[item_id]);
            console.log(queryObj);
            let owner_id = queryObj[0].owner_id;
            console.log(owner_id);
            buyer_id = parseInt(buyer_id);
            let orderObj = {
                buyer_id : buyer_id, 
                owner_id : owner_id,
                order_status : "new",
                totalPrice : totalPrice
            };
            console.log(orderObj);
            var insertedRow = await  conn.query('INSERT INTO orders SET ?', [orderObj]);
            console.log(insertedRow);
            let order_id = insertedRow.insertId;
            for(let i=0; i< cartItems.length; i++){
                let {item_id, item_quantity, item_calculatedPrice} = cartItems[i];
                let orderDetails = {order_id, item_id, item_quantity, item_calculatedPrice};
                //let orderDetails = {...cartItems[0], order_id};
                console.log(orderDetails);
                var insertedItem = await  conn.query('INSERT INTO order_details SET ?', [orderDetails]);
                
            }
            var deleteItem = await conn.query('DELETE FROM cart WHERE buyer_id = ?', [buyer_id]);
            await conn.query("COMMIT");
            message = "Order is placed successfully!!";
            console.log("in place order method..");
            console.log(message);
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Order is not placed successfully!!";
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

var buyerUpcomingOrders = async(buyer_id) =>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //let cartItems = await conn.query('select owner_restName, item_name, item_description, item_quantity, item_calculatedPrice from owner_details, orders, order_details where orders.buyer_id=? and orders.order_id = order_details.order_id and orders.owner_id = owner_details.owner_id',[buyer_id]);
            let ordersList = await conn.query('select order_id,owner_id, order_status, totalPrice from orders where buyer_id = ? and order_status != ? and order_status != ?',[buyer_id, "delivered", "cancelled"]);
            let ordersArr = [];
            console.log(ordersList);
            for(let index = 0; index < ordersList.length; index++){
                let order = ordersList[index];
                let owner_id = order.owner_id;
                let order_id = order.order_id;
                let totalPrice = order.totalPrice;
                let order_status = order.order_status;
                let queryObj = await conn.query('select owner_restName from owner_details where owner_id = ?',[owner_id]);
                console.log("query details");
                console.log(queryObj);
                let owner_restName = queryObj[0].owner_restName;
                queryObj = await conn.query('select item_id, item_quantity, item_calculatedPrice from order_details where order_id = ?',[order_id]);
                console.log("item details...");
                console.log(queryObj);
                
                let itemsArr = [];
                for(j=0; j<queryObj.length; j++){
                    let {item_id, item_quantity, item_calculatedPrice} = queryObj[j];
                    let selectQuery = await conn.query('select item_name from menu where item_id= ?',[item_id]);
                    console.log("item name..");
                    console.log(selectQuery);
                    let item_name = selectQuery[0].item_name;
                    itemsArr.push({item_name, item_quantity, item_calculatedPrice});
                }
                let orderEle = {
                    owner_restName : owner_restName,
                    order_status : order_status,
                    items : itemsArr,
                    totalPrice :totalPrice
                };
                ordersArr.push(orderEle);
            }
            var returnObj = {"orders" : ordersArr};
            await conn.query("COMMIT");
            message = returnObj;
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Order cannot be shown!!";
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

var buyerPastOrders = async(buyer_id) =>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //let cartItems = await conn.query('select owner_restName, item_name, item_description, item_quantity, item_calculatedPrice from owner_details, orders, order_details where orders.buyer_id=? and orders.order_id = order_details.order_id and orders.owner_id = owner_details.owner_id',[buyer_id]);
            let ordersList = await conn.query('select order_id,owner_id, order_status, totalPrice from orders where buyer_id = ? and order_status = ? or order_status = ?',[buyer_id, "delivered", "cancelled"]);
            let ordersArr = [];
            console.log(ordersList);
            for(let index = 0; index < ordersList.length; index++){
                let order = ordersList[index];
                /*let owner_id = order.owner_id;
                let order_id = order.order_id;
                let order_status = order.order_status;*/
                let{owner_id, order_id, order_status, totalPrice} = order;
                let queryObj = await conn.query('select owner_restName from owner_details where owner_id = ?',[owner_id]);
                console.log("query details");
                console.log(queryObj);
                let owner_restName = queryObj[0].owner_restName;
                queryObj = await conn.query('select item_id, item_quantity, item_calculatedPrice from order_details where order_id = ?',[order_id]);
                console.log("item details...");
                console.log(queryObj);
                
                let itemsArr = [];
                for(j=0; j<queryObj.length; j++){
                    let {item_id, item_quantity, item_calculatedPrice} = queryObj[j];
                    let selectQuery = await conn.query('select item_name from menu where item_id= ?',[item_id]);
                    console.log("item name..");
                    console.log(selectQuery);
                    let item_name = selectQuery[0].item_name;
                    itemsArr.push({item_name, item_quantity, item_calculatedPrice});
                }
                let orderEle = {
                    owner_restName : owner_restName,
                    order_status : order_status,
                    items : itemsArr,
                    totalPrice
                };
                ordersArr.push(orderEle);
            }
            var returnObj = {"orders" : ordersArr};
            await conn.query("COMMIT");
            message = returnObj;
            status = true;
        }
    }catch(e){
        console.log(e);
        message = "Order cannot be shown!!";
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
    placeOrder : placeOrder,
    buyerUpcomingOrders : buyerUpcomingOrders,
    buyerPastOrders : buyerPastOrders
}