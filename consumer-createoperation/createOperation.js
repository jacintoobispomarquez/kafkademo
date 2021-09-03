const Pool = require('pg').Pool
let pool;
const tableName = 'operations';
const { rollback } = require('./rollback');

exports.createOperation = function(transaction, value, config){

    pool = new Pool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port,
      })

    const idName = 'operation';
    const data = JSON.parse(value);

    const existClient = pool.query(`SELECT * FROM ${tableName} where ${idName} = ${transaction}`).then(results => {
        if(results.rowCount == 0){
            const done = insertOperation(data, transaction);
        }
    }).catch(err => {
        rollback(transaction);
        console.log("An error ocurred reading record" + err);
    });
}

function insertOperation(data, transaction){
    if(data==null || data==undefined) return new Error("Incorrect Namespace cannot be saved")
    else{
        var values = "";
        var fields = "";
        var init = true;
        data.operation = transaction;
        const datePostgres = new Date(data.initDate);
        if(data.amount==null) data.amount=0;
        data.initDate = `${datePostgres.getFullYear()}-${datePostgres.getMonth()+1}-${datePostgres.getDate()} 00:00:00`;
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

