const errors = require('../../service/errors');
const { positions } = require('../../service/generator');
const { client } = require('./conn');
const { column } = require('./tables');

//PK always first
const columns = [
    new column('id', 'int', 10, undefined, true, true),
    new column('name', 'varchar', 255, undefined, true),
];

const table_name = 'api_positions'

const insert_positions_table = () => {
    let col_str = [];
    columns.forEach(col => {
        col_str.push(col.string());
    });
    return client.conn.promise().execute(`CREATE TABLE IF NOT EXISTS \`${table_name}\` (${col_str.join(', ')}, PRIMARY KEY (\`${columns[0].name}\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`)
};

async function mockup() {
    return client.conn.promise().query(`INSERT INTO ${table_name} (id, name) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name)`, [positions]);
}

async function get_positions(){
    let res = await client.conn.promise().query(`SELECT * FROM ${table_name}`);
    if (res[0].length==0) {
        return Promise.reject(errors.PositionsNotFound);
    }
    return Promise.resolve(res[0]);
}

module.exports = {
    insert_positions_table,
    mockup,
    get_positions,
}