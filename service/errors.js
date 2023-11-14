class ErrorBase extends Error {
    TokenRequired = 'The token required to this request.';
    TokenExpired = 'The token expired.';
    ValidationFailed = 'Validation failed.';

    UserIdNotInteger = 'The user_id must be an integer.';

    UserNorExist = 'The user with the requested identifier does not exist.'
};


module.exports = new ErrorBase();
