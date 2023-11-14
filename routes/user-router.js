const express = require('express');
const useBodyParser = require('../tools/body-parser.js');
const { get_user_by_id, save_user_get_id, User } = require('../models/mysql/user.js');
const ResponseBase = require('../models/web/response.js');
const mid = require('../middleware/base.js');
const validator = require('../service/user_validator.js');
const errors = require('../service/errors.js');
let multer = require('multer');
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


usersRouter.post('/',upload.fields([{name: 'photo', maxCount: 1}]), mid.response_base, mid.token_required, async (req, res) => {
    const { name, email, phone, position_id } = req.body;
    const photo = req.files.photo;
    const validationPromises = [
        { field: 'name', promise: validator.name_validation(name) },
        { field: 'email', promise: validator.email_validation(email) },
        { field: 'phone', promise: validator.phone_validation(phone) },
        { field: 'position_id', promise: validator.position_validation(position_id) },
        { field: 'photo', promise: validator.photo_validation(photo) },
    ];
    const validationResults = await Promise.allSettled(
        validationPromises.map(({ promise, field }) => promise.then(
            () => ({ field, status: 'fulfilled' }),
            reason => ({ field, status: 'rejected', reason })
        ))
    );

    let rejected = validationResults
        .filter(result => result.status === 'rejected')
    if (rejected.length == 0) {
        let inserted_id = await save_user_get_id(new User(name, email, phone, position_id, photo));
        res.locals.body.add_result('user_id', inserted_id);
    } else {
        res.locals.body.add_message(errors.ValidationFailed)
        rejected.forEach(result => {
            const { field, reason } = result;
            res.locals.body.add_fails(field, reason)
        });
        res.status(422)
    }
    res.json(res.locals.body);
});

module.exports = usersRouter;