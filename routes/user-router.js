const express = require('express');
const useBodyParser = require('../tools/body-parser.js');
const { get_user_by_id } = require('../models/mysql/user.js');
const ResponseBase = require('../models/web/response.js');
const mid = require('../middleware/base.js');

const usersRouter = express.Router();

useBodyParser(usersRouter);

usersRouter.get('/:user_id',mid.response_base, mid.is_number('user_id'), (req,res)=>{
    get_user_by_id(req.params.user_id)
    .then(user=>{
        res.locals.body.add_result('user', user)
    })
    .catch(err=>{
        res.locals.body.add_message(err)
        res.locals.body.add_fails('user_id', ['User not found'])
        res.statusCode=404;
    })
    .finally(()=>{
        res.json(res.locals.body)
    });
});

module.exports = usersRouter;