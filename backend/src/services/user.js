const joi = require('joi')
const logger = require('./../logger');
const user = require('./../db/models/user')
const crypto = require('crypto');
const config = require('../config');
const bcrypt = require('bcrypt');

const validateUserData = (data) => {
    const schema = joi.object({
        userName: joi.string(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        mobileNumber: joi.string().required()
    });
    return schema.validate(data);
}
async function create(data) {
    var response = {};
    logger.log(`Validating the user data - ${JSON.stringify(data)}`)
    const { error } = validateUserData(data);
    if (error) {
        response.status = false;
        response.message = error.details[0].message
        logger.log(`Error is loginData - ${JSON.stringify(response)}`)
        return response;
    }
    const newUser = new user(data);
    var salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    response.user = newUser;
    return {
        data: response,
        cache: {}
    };
}

module.exports = { create }