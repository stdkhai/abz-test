class ErrorBase extends Error {
    // middlware errors
    TokenRequired = 'The token required to this request.';
    TokenExpired = 'The token expired.';
    ValidationFailed = 'Validation failed.';

    UserIdNotInteger = 'The user_id must be an integer.';

    // DB errors
    UserNorExist = 'The user with the requested identifier does not exist.'
    PositionsNotFound = 'Positions not found.'

    // response errors
    PageNotFound = 'Page not found'
};


module.exports = new ErrorBase();
