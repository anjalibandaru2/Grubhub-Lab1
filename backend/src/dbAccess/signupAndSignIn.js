const dbConnPool = require("./dbConnPool");

var signupOwner =  async (ownerData) =>{
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    try{
        console.log("In signup owner dbAccess..");
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            var userExists = await isExistingUser(ownerData.owner_email, "owner");
            if(!userExists){
                console.log("in if...");
                var insertedUser =await  conn.query('INSERT INTO owner_details SET ?', [ownerData]);
                await conn.query("COMMIT");
                console.log(insertedUser.insertId);
                insertId = insertedUser.insertId;
                message = "Signup is successful!!";
                status = true;
                
            } else {
                console.log("in else..");
                status = false;
                message = "Owner already exists! Please give another email id";
            }
            console.log(message);
        }
    }catch(e){
        console.log(e);
        message = "Issue at database or server.Please restart the systems!";
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

var signupBuyer = async (buyerData) => {
    let conn;
    let insertId = -1;
    let message = "";
    let status = false;
    console.log("In signup buyer dbAccess..");
    try{
        conn = await dbConnPool.getConnection();
        if(conn){
            await conn.query("START TRANSACTION");
            console.log("buyer data is..");
            console.log(buyerData);
            var userExists = await isExistingUser(buyerData.buyer_email, "buyer");
            console.log("user exists??");
            console.log(userExists);
            if(!userExists){
                console.log("in if...");
                var insertedUser =await  conn.query('insert into buyer_details set ?', [buyerData]);
                await conn.query("COMMIT");
                console.log(insertedUser.insertId);
                insertId = insertedUser.insertId;
                message = "Signup is successful!!";
                status = true;
            } else {
                console.log("in else..");
                status = false;
                message = "Buyer already exists! Please give another email id";
            }
            console.log(message);
        }
    }catch(e){
        console.log(e);
        message = "Issue at database or server.Please restart the systems!";
        status = false;
    }
    finally{
        if(conn){
            await conn.release();
            await conn.destroy();
        }
        return {
            message : message,
            status : status
        };
    }
}
let isExistingUser = async (emailID, userType) => {
    let conn = await dbConnPool.getConnection();
    console.log("email id is.."+emailID);
    let table, prefix= "";
    if(userType == "owner"){
        table = "owner_details";
        prefix = "owner_";
    } else {
        table = "buyer_details";
        prefix = "buyer_";
    }
    let result = await conn.query('Select * from ?? where '+prefix+'email=?',[table,emailID]);
    console.log(result.length);
    if(result.length > 0){
        console.log("in if..");
        return true;
    } else {
        console.log("in else...");
        return false;
        
    }
}
var signIn = async (userData)=>{
    let conn = await dbConnPool.getConnection();
    let table;
    let {email,password,userType} = userData;
    let userPassword = password;
    let prefix = "", userIDText = "", usernameText = "", name="";
    if(userType == "owner"){
        table = "owner_details";
        prefix = "owner_";
    } else {
        table = "buyer_details";
        prefix = "buyer_";
    }
    var message = "Invalid Credentials";
    var userID = -1;
    status = false;
    try{
        console.log("In signin dbAccess..");
        await conn.query("START TRANSACTION");
        let result = await conn.query('Select '+prefix+'password, '+prefix+'id, '+prefix+'name from ?? where '+prefix+'email=?',[table,email]);
        await conn.query('COMMIT');
        if(result.length > 0){
            dbPassword = userType == "owner" ? result[0]["owner_password"] : result[0]["buyer_password"];
            //console.log("user password.."+userPassword);
            //console.log("dbPassword.."+dbPassword);
            if(userPassword == dbPassword){
                message = "Loggedin successfully";
                userIDText = userType == "owner" ? "owner_id" : "buyer_id" ;
                userID = userType == "owner" ? result[0]["owner_id"] : result[0]["buyer_id"] ;
                name = userType == "owner" ? result[0]["owner_name"] : result[0]["buyer_name"] ;
                status = true;
            } else{
                message = "Incorrect Password!!";
            }
        } else {
            message = "Invalid Email";
        }
       // console.log("result is..");
        //console.log(result);
        console.log(message);
    } catch(e){
        console.log(e);
        message = "Issue at database or server.Please restart the systems!";
        throw e;
    } finally{
        if(conn){
            conn.release();
            conn.destroy();
        }
        return {
                status : status,
                message : message,
                [userIDText] : userID,
                userType : userType,
                name : name
        };
    }
}

/*var isExistingUser = (email)=>{
    
}*/

module.exports = {
    signupOwner : signupOwner,
    signupBuyer : signupBuyer,
    signIn : signIn
}