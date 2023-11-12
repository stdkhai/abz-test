require('dotenv').config();
const mysql = require('mysql2');

const env = process.env;

class SQL{
    constructor(){
        this.conn = mysql.createPool({
            host: env.mysql_host || 'localhost',
            user: env.mysql_user || 'root',
            password: env.mysql_pass || '',
            database: env.mysql_database || 'dev',
        });
    }
}

const mysql_client = new SQL();

module.exports = mysql_client;