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
        .then(result => {
            if (result == 0) {
                res.locals.body.add_message(errors.TokenMailformed)
                res.statusCode = 401;
                res.json(res.locals.body);
                return
            }
            next()
        })
        .catch(err => {
            console.log(err);
            res.json(res.locals.body);
            return
        })

}

/**
 * validate request params only
 * @param {string} v_name value name, for fails and req.params;
 * @param {boolean} isQuery 
 * @returns 
 */
function is_number(v_name, isQuery) {
    return (req, res, next) => {
        const value = isQuery ? req.query[v_name] : req.params[v_name];
        const typed = Number(value);
        if (isNaN(typed)) {
            res.locals.body.add_message(errors.ValidationFailed);
            res.locals.body.add_fails(v_name, [errors.MustBeNumber]);
            res.statusCode = 400;
            return res.json(res.locals.body);
        }
        next();
    }
}

/**
 * 
 * @param {string} v_name 
 * @param {number} max 
 * @param {number} min 
 */
function pagination_validator(req, res, next) {
    const { page, offset, count } = req.query;
    let varStorage = [];
    if (!page && !offset){
        res.locals.body.add_fails('error', ["The field 'page' or 'offser' is required"])
    }
    page ? varStorage.push({ name: 'page', value: Number(page) }) : "";
    offset ? varStorage.push({ name: 'offset', value: Number(offset) }) : "";
    count ? varStorage.push({ name: 'count', value: Number(count) }) : varStorage.push({ name: 'count', value: 5 });

    varStorage.forEach(v => {
        switch (v.name) {
            case 'page':
                if (isNaN(v.value)) {
                    res.locals.body.add_fails(v.name, [errors.MustBeNumber])
                }
                if (v.value < 1) {
                    res.locals.body.add_fails(v.name, [errors.SoSmallValue(1, v.name)])
                }
                break;
            case 'offset':
                if (isNaN(v.value)) {
                    res.locals.body.add_fails(v.name, [errors.MustBeNumber])
                }
                if (v.value < 0) {
                    res.locals.body.add_fails(v.name, [errors.SoSmallValue(0, v.name)])
                }
                break;
            case 'count':
                if (isNaN(v.value)) {
                    res.locals.body.add_fails(v.name, [errors.MustBeNumber])
                }
                if (v.value < 1) {
                    res.locals.body.add_fails(v.name, [errors.SoSmallValue(1, v.name)])
                }
                if (v.value > 100) {
                    res.locals.body.add_fails(v.name, [errors.SoBigValue(100, v.name)])
                }
                break;
        }
    });
    if (res.locals.body.fails && Object.keys(res.locals.body.fails).length != 0) {
        res.locals.body.add_message(errors.ValidationFailed)
        res.statusCode = 422;
        return res.json(res.locals.body);
    }
    next();
};

module.exports = {
    response_base,
    token_required,
    is_number,
    pagination_validator,
}