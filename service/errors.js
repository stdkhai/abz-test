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
    PageNotFound = 'Page not found';

    //vaidator errors
    MustBeString = 'Value must be a string'
    MustBeNumber = 'Value must be an integer'
    MustBeBoolean = 'Value must be a boolean'
    InvalidEmail = 'The email must be a valid email address.'
    InvalidPhone = 'The phone must be a valid phone number in Ukraine format +380'
    FileSoBig = 'The file size is too large.'
    InvalidFile = 'The file type is not supported.'

    /**
     * 
     * @param {string} value value name
     * @param {number} min 
     * @returns 
     */
    SoShortString(value, min){
        return `The ${value} must be at least ${min} characters.`
    }

    /**
     * 
     * @param {string} value 
     * @param {number} max 
     * @returns 
     */
    SoLongString(value, max){
        return `The ${value} must be not more ${max} characters.`
    }

    ImageTooLarge(max){
        return `Image must be less than ${max} * ${max} px`
    }

    FieldIsRequired(name){
        return `Field ${name} is required.`
    }
};


module.exports = new ErrorBase();
