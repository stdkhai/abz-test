const { get_token } = require("../models/mysql/token");
const ResponseBase = require("../models/web/response");
const errors = require("../service/errors");
const { validate_token } = require("../service/token");

/**
 * required, call this first to  init response base
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {*} next 
 */
function response_base(req, res, next) {
    res.locals.body = new ResponseBase();
    next();
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {*} next 
 */
function token_required(req, res, next) {
    if (!req.headers?.token) {
        res.locals.body.add_message(errors.TokenRequired)
        res.statusCode = 499;
        return res.json(res.locals.body);
    }
    if (!validate_token(req.headers.token)) {
        res.locals.body.add_message(errors.TokenExpired)
        res.statusCode = 401;
        return res.json(res.locals.body);
    }
    get_token(req.headers.token)
    .then(result=>{
        if (result==0) {
            res.locals.body.add_message(errors.TokenMailformed)
            res.statusCode = 401;
            res.json(res.locals.body);
            return
        }
        next()
    })
    .catch(err=>{
        console.log(err);
        res.json(res.locals.body);
        return
    })

}

/**
 * 
 * @param {string} v_name value name, for fails and req.params;
 * @returns 
 */
function is_number(v_name) {
    return (req, res, next) => {
        const typed = Number(req.params[v_name]);
        if (isNaN(typed)) {
            res.locals.body.add_message(errors.ValidationFailed);
            res.locals.body.add_fails(v_name, [errors.UserIdNotInteger]);
            res.statusCode = 400;
            return res.json(res.locals.body);
        }
        next();
    }
}

module.exports = {
    response_base,
    token_required,
    is_number,
}