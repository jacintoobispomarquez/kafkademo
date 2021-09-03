const Pool = require('pg').Pool
let pool;
const { rollback } = require('./rollback');

exports.compensate = function(transaction, config){

    pool = new Pool({
        user: config.user,
        host: config.host,
        database: config.database,
        password: config.password,
        port: config.port,
      })
      
    const idName = 'transactionid';

    const existClient = pool.query(`DELETE FROM ${config.table} where ${idName}  = ${transaction}`).then(results => {
        if(results.rowCount == 0){
            console.log(`Transaction ${transaction} for ${config.table} has been compensated`);
        }
    }).catch(err => {
        rollback(transaction);
        console.log("An error ocurred reading record" + err);
    });
}

