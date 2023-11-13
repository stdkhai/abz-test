const { insert_positions_table } = require("./position");
const { insert_token_table } = require("./token");
const { insert_user_table } = require("./user");

const sql_migrate = ()=>{
    insert_user_table();
    insert_token_table();
    insert_positions_table();
}

module.exports = sql_migrate