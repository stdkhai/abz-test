const errors = require('../../service/errors');
const { client } = require('./conn');
const { column } = require('./tables');


class User{
    constructor(name, email, phone, position_id, photo_id){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.position_id = position_id
        this.photo = `/images/${photo_id}.jpg`;
        this.registration_timestamp = new Date().toISOString();
    }
}

//PK always first
const columns = [
    new column('id', 'int', 10, undefined, true, true),
    new column('name', 'varchar', 255, undefined, true),
    new column('email', 'varchar', 255, undefined, true),
    new column('phone', 'varchar', 255, undefined, true),
    new column('position_id', 'int', 10, undefined, true),
    new column('registration_timestamp', 'timestamp', undefined, undefined, true),
    new column('photo', 'varchar', 255, undefined, true),
];

const table_name = "api_users"

const insert_user_table = () => {
    let col_str = [];
    columns.forEach(col => {
        col_str.push(col.string());
    });
    return client.conn.promise().execute(`CREATE TABLE IF NOT EXISTS \`${table_name}\` (${col_str.join(', ')}, PRIMARY KEY (\`${columns[0].name}\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`)
};

/**
 * 
 * @param {Array} users 
 */
async function save_users(users) {
    client.conn.promise().query(`INSERT INTO ${table_name} (${columns.filter(e => e.name != 'id').map(e => e.name).join(', ')}) VALUES ?`,
        [
            users.map(user => {
                return [user.name, user.email, user.phone, user.position_id, user.registration_timestamp, user.photo]
            })
        ]);
}

async function save_user_get_id(user){
    await client.conn.promise().query(`INSERT INTO ${table_name} (${columns.filter(e => e.name != 'id').map(e => e.name).join(', ')}) VALUES (?)`,
        [[user.name, user.email, user.phone, user.position_id, user.registration_timestamp, user.photo]]);
    let res = await client.conn.promise().query('SELECT LAST_INSERT_ID() as id;')
    return res[0][0]['id'];
}

/**
 * 
 * @param {Number} id 
 * @returns {Object} `user`
 */
async function get_user_by_id(id){
    let res = await client.conn.promise().query(`SELECT * FROM ${table_name} WHERE ${columns[0].name}=? LIMIT 1`, [id])
    if (res[0].length==0){
        return Promise.reject(errors.UserNorExist);
    }else{
        return Promise.resolve(res[0][0]);
    }
}

async function get_users_pag(startIdx, count){
    let [res] = await client.conn.promise().query(`
    SELECT users.*, api_positions.name as position ,
    COUNT(*) OVER() as total_count
    FROM ${table_name} as users
    LEFT JOIN api_positions ON users.position_id = api_positions.id
    ORDER BY users.registration_timestamp DESC LIMIT ?, ? `,
    [startIdx, count])
    return res
}

module.exports = {
    insert_user_table,
    save_users,
    get_user_by_id,
    save_user_get_id,
    User,
    get_users_pag,
}