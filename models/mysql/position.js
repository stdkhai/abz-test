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

module.exports = {
    insert_positions_table,
    mockup,
}