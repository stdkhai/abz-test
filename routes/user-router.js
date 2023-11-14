const express = require('express');
const useBodyParser = require('../tools/body-parser.js');
const { get_user_by_id, save_user_get_id } = require('../models/mysql/user.js');
const ResponseBase = require('../models/web/response.js');
const mid = require('../middleware/base.js');
const validator = require('../service/user_validator.js');
const errors = require('../service/errors.js');

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


usersRouter.post('/', mid.response_base, mid.token_required, async (req, res) => {
    const { name, email, phone, position_id, photo } = req.body;
    const validationPromises = [
        { field: 'name', promise: name_validation(name) },
        { field: 'email', promise: email_validation(email) },
        { field: 'phone', promise: phone_validation(phone) },
        { field: 'position_id', promise: position_validation(position_id) },
        { field: 'photo', promise: photo_validation(photo) },
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
        let inserted_id = await save_user_get_id({name: name, email: email, phone: phone, position_id: position_id, photo: photo});
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