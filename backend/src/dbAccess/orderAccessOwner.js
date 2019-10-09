const dbConnPool = require("./dbConnPool");

var updateOrderStatus =  async (order_id, order_status) =>{
    let conn;
    //let insertId = -1;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var insertedItem = await  conn.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, order_id]);
            await conn.query("COMMIT");
            //console.log(insertedItem.itemId);
            //insertId = insertedItem.insertId;
            message = "Order is updated successfully!!";
            status = true;
        }
        console.log("in update order status");
        console.log(message);

    }catch(e){
        console.log(e);
        message = "Order is not updated!!";
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

var ownerUpcomingOrders = async(owner_id) =>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //let cartItems = await conn.query('select owner_restName, item_name, item_description, item_quantity, item_calculatedPrice from owner_details, orders, order_details where orders.buyer_id=? and orders.order_id = order_details.order_id and orders.owner_id = owner_details.owner_id',[buyer_id]);
            let ordersList = await conn.query('select order_id, buyer_id, order_status from orders where owner_id = ? and order_status != ?',[owner_id, "delivered"]);
            let ordersArr = [];
            console.log(ordersList);
            for(let index = 0; index < ordersList.length; index++){
                let order = ordersList[index];
                let buyer_id = order.buyer_id;
                let order_id = order.order_id;
                let order_status = order.order_status;
                let queryObj = await conn.query('select buyer_name, buyer_address from buyer_details where buyer_id = ?',[buyer_id]);
                let buyer_name = queryObj[0].buyer_name;
                let buyer_address = queryObj[0].buyer_address;
                queryObj = await conn.query('select item_id, item_quantity, item_calculatedPrice from order_details where order_id = ?',[order_id]);
                let itemsArr = [];
                for(j=0; j<queryObj.length; j++){
                    let {item_id, item_quantity, item_calculatedPrice} = queryObj[j];
                    let selectQuery = await conn.query('select item_name from menu where item_id= ?',[item_id]);
                    let item_name = selectQuery[0].item_name;
                    itemsArr.push({item_name, item_quantity, item_calculatedPrice});
                }
                let orderEle = {
                    buyer_name : buyer_name,
                    buyer_address : buyer_address,
                    order_status : order_status,
                    order_id : order_id,
                    items : itemsArr
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

var ownerPastOrders = async(owner_id) =>{
    let conn;
    let message = "";
    let status = false;
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            //let cartItems = await conn.query('select owner_restName, item_name, item_description, item_quantity, item_calculatedPrice from owner_details, orders, order_details where orders.buyer_id=? and orders.order_id = order_details.order_id and orders.owner_id = owner_details.owner_id',[buyer_id]);
            let ordersList = await conn.query('select order_id, buyer_id, order_status from orders where owner_id = ? and order_status = ?',[owner_id, "delivered"]);
            let ordersArr = [];
            console.log(ordersList);
            for(let index = 0; index < ordersList.length; index++){
                let order = ordersList[index];
                let buyer_id = order.buyer_id;
                let order_id = order.order_id;
                let order_status = order.order_status;
                let queryObj = await conn.query('select buyer_name, buyer_address from buyer_details where buyer_id = ?',[buyer_id]);
                let buyer_name = queryObj[0].buyer_name;
                let buyer_address = queryObj[0].buyer_address;
                queryObj = await conn.query('select item_id, item_quantity, item_calculatedPrice from order_details where order_id = ?',[order_id]);
                let itemsArr = [];
                for(j=0; j<queryObj.length; j++){
                    let {item_id, item_quantity, item_calculatedPrice} = queryObj[j];
                    let selectQuery = await conn.query('select item_name from menu where item_id= ?',[item_id]);
                    let item_name = selectQuery[0].item_name;
                    itemsArr.push({item_name, item_quantity, item_calculatedPrice});
                }
                let orderEle = {
                    buyer_name : buyer_name,
                    buyer_address : buyer_address,
                    order_status : order_status,
                    order_id : order_id,
                    items : itemsArr
                };
                ordersArr.push(orderEle);
            }
            var returnObj = {"orders" : ordersArr};
            await conn.query("COMMIT");
            message = returnObj;
            status = true;
            console.log(message);
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
    updateOrderStatus : updateOrderStatus,
    ownerUpcomingOrders : ownerUpcomingOrders,
    ownerPastOrders : ownerPastOrders
}