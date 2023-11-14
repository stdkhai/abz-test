const tinify = require("tinify");
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');


const env = process.env;
tinify.key = env.tinify_api_key;

/**
 * 
 * @param {Buffer} image 
 * @returns {string} id
 */
async function tinify_image(image){
    const source = tinify.fromBuffer(image);
    const resized = source.resize({
        method: "fit",
        width: 70,
        height: 70,
      });
    const id = uuidv4();
    await resized.toFile(`./public/images/${id}.jpg`);
    return id;
}

module.exports = {
    tinify_image,
}