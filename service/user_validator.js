const { get_positions } = require("../models/mysql/position")
const errors = require("./errors")
const sizeOf = require('image-size')


/**
 * 
 * @param {string} name 
 * @returns 
 */
async function name_validation(name) {
    if (!name) {
        console.log('empty name');
        return Promise.reject(errors.FieldIsRequired('name'));
    }
    switch (true) {
        case typeof name !== 'string':
            return Promise.reject(errors.MustBeString)
        case name.length < 2:
            return Promise.reject(errors.SoShortString('name', 2))
        case name.length > 60:
            return Promise.reject(errors.SoLongString('name', 60))
    }
    return Promise.resolve(true)
}

async function email_validation(email) {
    if (!email) {
        return Promise.reject(errors.FieldIsRequired('email'));
    }
    const regex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/gm;
    switch (true) {
        case typeof email !== 'string':
            return Promise.reject(errors.MustBeString)
        case email.length < 2:
            return Promise.reject(errors.SoShortString('email', 2));
        case email.length > 100:
            return Promise.reject(errors.SoLongString('email', 100));
        case !regex.test(email):
            return Promise.reject(errors.InvalidEmail);
    }
    return Promise.resolve(true)
}

async function phone_validation(phone){
    if (!phone) {
        return Promise.reject(errors.FieldIsRequired('phone'));
    }
    const regex = /^[\+]{0,1}380([0-9]{9})$/gm
    switch (true) {
        case typeof phone !== 'string':
            return Promise.reject(errors.MustBeString)
        case !regex.test(phone):
            return Promise.reject(errors.InvalidPhone)
    }
    return Promise.resolve(true);
}

async function position_validation(position_id){
    if (!position_id) {
        return Promise.reject(errors.FieldIsRequired('position_id'));
    }
    let positions = await get_positions().catch(err=>{console.log(err);});
    switch (true) {
        case typeof position_id !== 'number':
            return Promise.reject(errors.MustBeNumber)
        case !positions.find(pos=>pos.id==position_id):
            return Promise.reject(errors.PositionsNotFound)
    }
    return Promise.resolve(true);
}

async function photo_validation(photo){
    const aviableFormats = ['jpg', 'jpeg']
    if (!photo) {
        return Promise.reject(errors.FieldIsRequired('photo'));
    }
    if (photo.length > 5*1024*1024) {
        return Promise.reject(errors.FileSoBig);
    }
    const dimensions = sizeOf(photo);  
    if (!aviableFormats.includes(dimensions.type)) {
        return Promise.reject(errors.InvalidFile);
    }
    if (dimensions.height > 70 || dimensions.width > 70) {
        return Promise.reject(errors.ImageTooLarge(70));
    }
    return Promise.resolve(true);
}

module.exports = {
    name_validation,
    email_validation,
    phone_validation,
    position_validation,
    photo_validation,
}