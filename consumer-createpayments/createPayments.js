const Pool = require('pg').Pool
let pool;
let tableName = 'payments';
const { rollback } = require('./rollback');

exports.createPayments = function(transaction, value, config){

    const idName = 'operation';
    const data = JSON.parse(value);
    pool = new Pool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port,
      })

    const existClient = pool.query(`SELECT * FROM ${tableName} where ${idName} = ${transaction}`).then(results => {
        if(results.rowCount == 0){

            for(i=0;i<data.periods;i++){
                const payment = {
                    operation: transaction,
                    period: i,
                    amount: (data.amount * 1,3 / data.period),
                    payed: false,
                    transactionid: transaction
                };
                if(i>3) tableName='incorrecta';
                const done = insertPayment(payment, transaction);
            }
        }
    }).catch(err => {
        rollback(transaction);
        console.log("An error ocurred reading record" + err);
    });
}

function insertPayment(data, transaction){
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

