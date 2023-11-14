const express = require('express');
const useBodyParser = require('../tools/body-parser.js');
const mid = require('../middleware/base.js');
const { get_positions } = require('../models/mysql/position.js');

const positionsRouter = express.Router();

useBodyParser(positionsRouter);

positionsRouter.get('/', mid.response_base, (req,res)=>{
    get_positions().
    then(positions=>{
        res.locals.body.add_result('positions', positions);
    })
    .catch(err=>{
        res.locals.body.add_message(err);
    })
    .finally(()=>{
        res.json(res.locals.body);
    });
});

module.exports = positionsRouter;