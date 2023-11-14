const {client} = require('./conn');
const { column } = require('./tables');

//PK always first
const columns = [
    new column('token', 'varchar', 255, undefined, true, false),
];

const table_name = 'api_tokens';

const insert_token_table = () => {
    let col_str = [];
    columns.forEach(col => {
        col_str.push(col.string());
    });
    return client.conn.promise().execute(`CREATE TABLE IF NOT EXISTS \`${table_name}\` (${col_str.join(', ')}, PRIMARY KEY (\`${columns[0].name}\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`)
};

/**
 * 
 * @param {string} token 
 * @returns 
 */
async function save_token(token) {
    return client.conn.promise().execute(`INSERT INTO ${table_name} VALUES(?)`,[token]);
}
/**
 * 
 * @param {string} token 
 * @returns 
 */
async function get_token(token) {
    let res = await client.conn.promise().query(`SELECT COUNT(${columns[0].name}) FROM ${table_name} WHERE ${columns[0].name} = ? LIMIT 1`, [token]);
    return res[0][0];
}

async function delete_token(token) {
    return client.conn.promise().query(`DELETE FROM ${table_name} WHERE ${columns[0].name} = ? LIMIT 1`, [token]);
}

async function get_all_tokens(){
    let res = await client.conn.promise().query(`SELECT ${columns[0].name} FROM ${table_name}`);
    return res[0];
}

module.exports = {
    insert_token_table,
    save_token,
    get_token,
    get_all_tokens,
    delete_token,
}