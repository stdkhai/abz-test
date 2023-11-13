const { faker } = require('@faker-js/faker');

const positions = [
    [1, "Developer"],
    [2, "Analyst"],
    [3, "Designer"],
    [4, "Manager"],
    [5, "Engineer"],
    [6, "Coordinator"],
    [7, "Specialist"],
]

function create_random_user() {
    let position = faker.helpers.arrayElement(positions);
    return {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.number("+380#########"),
        position: position[1],
        position_id: position[0],
        registration_timestamp: faker.date.past().toISOString(),
        photo: faker.image.avatar(),
    }
}
/**
 * 
 * @param {Number} count 
 */
function get_n_users(count){
    return faker.helpers.multiple(create_random_user, {count: count})
}

module.exports = {
    positions,
    get_n_users,
}


