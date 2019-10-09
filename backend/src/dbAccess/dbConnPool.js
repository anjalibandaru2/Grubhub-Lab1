var mysql = require('promise-mysql');
var configDB = {
    connectionLimit: 500,
    host : 'localhost',
    user : 'root',
    password : 'sjsu',
    database : 'grubhublab1',
    port : 3306
}

var getConnection = async()=>{
    var pool = await mysql.createPool(configDB);
    return new Promise(async (resolve,reject) => {
        var pool = await mysql.createPool(configDB);
        pool.getConnection().then(function(conn){
            if(conn){
                console.log("connected!!@@");  
               resolve(conn);
            }
        }).catch(function(err){
            reject(err);
            console.log("in error...")
            console.log(err);
        });
    });
}
var connectToDB = async function(){
    var pool = await mysql.createPool(configDB);
    pool.getConnection().then( function(conn){
        if(conn){
            console.log("connected!!@@");
            return conn;
        }
    }).catch(function(err){
        console.log("in error...")
        console.log(err);
    });
}
module.exports.getConnection = getConnection;