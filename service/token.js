require('dotenv').config();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { save_token } = require('../models/mysql/token');


const env = process.env;

function generate_token() {
    const token = jwt.sign({ id: uuidv4() }, env.secret, { expiresIn: '40m' });
    save_token(token);
    return token;
}

/**
 * 
 * @param {string} token 
 * @returns {boolean} 
 */
function validate_token(token) {
    try {
        jwt.verify(token, env.secret);
    } catch (error) {
        if (error != jwt.TokenExpiredError) {
            console.log('Token verify error: ', error);
        }
        return false;
    }
    return true;
}

module.exports = {
    generate_token,
    validate_token,
}