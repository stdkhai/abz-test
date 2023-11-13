const {client} = require('./conn');
const { column } = require('./tables');

//PK always first
const columns = [
    new column('token', 'varchar', 255, undefined, true, false),
];

const insert_token_table = () => {
    let col_str = [];
    columns.forEach(col => {
        col_str.push(col.string());
    });
    return client.conn.promise().execute(`CREATE TABLE IF NOT EXISTS \`api_tokens\` (${col_str.join(', ')}, PRIMARY KEY (\`${columns[0].name}\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`)
};

module.exports = {
    insert_token_table,
}