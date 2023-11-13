require('dotenv').config();
const mysql = require('mysql2');

const env = process.env;

class SQL {
    constructor() {
        this.conn = mysql.createPool({
            host: env.mysql_host || 'localhost',
            user: env.mysql_user || 'root',
            password: env.mysql_pass || '',
            database: env.mysql_database || 'dev',
        });
    }

}

const client = new SQL();

client.conn.getConnection((err) => {
    if (err){console.log("Error connect to DB: ", err);}
})


module.exports = { client }