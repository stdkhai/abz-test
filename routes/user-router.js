const express = require('express');
const useBodyParser = require('../tools/body-parser.js');
const { get_user_by_id, save_user_get_id, User, get_users_pag } = require('../models/mysql/user.js');
const ResponseBase = require('../models/web/response.js');
const mid = require('../middleware/base.js');
const validator = require('../service/user_validator.js');
const errors = require('../service/errors.js');
let multer = require('multer');
const { tinify_image } = require('../service/api.js');
const { delete_token } = require('../models/mysql/token.js');
let upload = multer();

const usersRouter = express.Router();

useBodyParser(usersRouter);

usersRouter.get('/:user_id', mid.response_base, mid.is_number('user_id'), (req, res) => {
    get_user_by_id(req.params.user_id)
        .then(user => {
            res.locals.body.add_result('user', user)
        })
        .catch(err => {
            res.locals.body.add_message(err)
            res.locals.body.add_fails('user_id', ['User not found'])
            res.statusCode = 404;
        })
        .finally(() => {
            res.json(res.locals.body)
        });
});


usersRouter.post('/', upload.fields([{ name: 'photo', maxCount: 1 }]), mid.response_base, mid.token_required, async (req, res) => {
    const { name, email, phone, position_id } = req.body;
    const photo = req.files.photo && req.files.photo.length != 0 ? req.files.photo[0] : undefined;
    const validationPromises = [
        { field: 'photo', promise: validator.photo_validation(photo ? photo.buffer : undefined) },
        { field: 'name', promise: validator.name_validation(name) },
        { field: 'email', promise: validator.email_validation(email) },
        { field: 'phone', promise: validator.phone_validation(phone) },
        { field: 'position_id', promise: validator.position_validation(position_id) },
    ];
    let rejectedMap = {};
    for (const item of validationPromises) {
        try {
            await item.promise;
        } catch (reason) {
            rejectedMap[item.field] = reason;
        }
    }
    if (Object.keys(rejectedMap).length == 0) {
        let id = await tinify_image(photo.buffer)
        let inserted_id = await save_user_get_id(new User(name, email, phone, position_id, id));
        res.locals.body.add_result('user_id', inserted_id);
        delete_token(req.headers.token);
    } else {
        res.locals.body.add_message(errors.ValidationFailed)
        for (const key in rejectedMap) {
            res.locals.body.add_fails(key, [rejectedMap[key]]);
        }
        res.status(422)
    }
    res.json(res.locals.body);
});


usersRouter.get('/', mid.response_base, mid.pagination_validator, async (req, res) => {
    let { page, offset, count } = req.query;
    let total_count = 0;
    page = Number(page);
    offset = Number(offset);
    count = !isNaN(Number(count)) ? Number(count) : 5;

    let startIdx = isNaN(offset) ? page * count : offset;
    let users = await get_users_pag(startIdx, count);
    res.locals.body.add_result('users', users)
    if (users.length == 0) {
        res.locals.body.add_message(errors.RecordsNotFound)
    } else {
        total_count = users[0].total_count;
        users = users.map(user => delete user.total_count);
    }
    const nextLink = users.length === count
        ? `/users?offset=${startIdx + count}&count=${count}`
        : null;

    const prevLink = startIdx > 0
        ? `/users?offset=${Math.max(0, startIdx - count)}&count=${count}`
        : null;
    res.locals.body.add_result('links', {
        prev_link: prevLink,
        next_link: nextLink,
    })
    res.locals.body.add_result('total_count', total_count);
    !isNaN(page) ? res.locals.body.add_result('page', page) : "";
    !isNaN(count) ? res.locals.body.add_result('count', count) : "";
    !isNaN(offset) ? res.locals.body.add_result('offset', offset) : "";
    const totalPages = Math.ceil(total_count / count);
    res.locals.body.add_result('total_pages', totalPages)
    res.json(res.locals.body)

})

module.exports = usersRouter;