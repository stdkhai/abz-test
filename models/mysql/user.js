const {client} = require('./conn');
const { column } = require('./tables');

//PK always first
const columns = [
    new column('id', 'int', 10, undefined, true, true),
    new column('name', 'varchar', 255, undefined, true),
    new column('email', 'varchar', 255, undefined, true),
    new column('phone', 'varchar', 255, undefined, true),
    new column('position', 'varchar', 255, undefined, true),
    new column('position_id', 'int', 10, undefined, true),
    new column('registration_timestamp', 'timestamp',undefined, undefined, true),
    new column('photo', 'varchar', 255, undefined, true),
];

const insert_user_table = () => {
    let col_str = [];
    columns.forEach(col => {
        col_str.push(col.string());
    });
    return client.conn.promise().execute(`CREATE TABLE IF NOT EXISTS \`api_users\` (${col_str.join(', ')}, PRIMARY KEY (\`${columns[0].name}\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`)
};

module.exports = {
    insert_user_table,
}