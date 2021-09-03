const Pool = require('pg').Pool
let pool;
const tableName = 'clients';
const { rollback } = require('./rollback');

exports.createClient = function(transaction, value, config){

    pool = new Pool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port,
      })
      
    const idName = 'rut';
    const data = JSON.parse(value);

    const existClient = pool.query("SELECT * FROM " + tableName + " where " + idName + " = '" + data.rut + "'").then(results => {
        if(results.rowCount == 0){
            const done = insertClient(data, transaction);
        }
    }).catch(err => {
        rollback(transaction);
        console.log("An error ocurred reading record" + err);
    });
}

function insertClient(data, transaction){
    if(data==null || data==undefined) return new Error("Incorrect Namespace cannot be saved")
    else{
        var values = "";
        var fields = "";
        var init = true;
        for(property in data){
            if(init){
                fields = fields + property;	
                values = values + "'" + data[property] + "'";	
            } 
            else{
                 values = values + ",'" + data[property]  + "'";	
                fields = fields + ","  + property;	
            }
            init = false;
        }
        pool.query(`INSERT INTO ${tableName}(${fields}) VALUES(${values})`).then(results => {
            if(results.rowCount < 1){
                // TO-DO Rollback
                rollback(transaction);
            }
        }).catch(err => {
            rollback(transaction);
            console.log("An error ocurred inserting record" + err);
        });
        
    } 
}

