const joi = require('joi')
const logger = require('./../logger');
const User = require('./../db/models/user')
const crypto = require('crypto')
const config = require('./../config')
const jwt = require('jsonwebtoken');

const validateLoginData = (data) => {
    const schema = joi.object({
        mobileNumber: joi.number().required(),
        password: joi.string().required(),
    });
    return schema.validate(data);
}
async function login(cache, data) {
    var response = {};
    logger.log(`Validating the login credentials - ${JSON.stringify(data)}`)
    const { error } = validateLoginData(data);
    if (error) {
        response.status = false;
        response.message = error.details[0].message
        logger.log(`Error is loginData - ${JSON.stringify(response)}`)
        return response;
    }
    logger.log(`CHECK CACHE DATA - ${JSON.stringify(cache)}`)

    var user;
    if (cache && cache.user)
        user = cache.user
    else
        user = await User.findOne({
            where: {
                mobileNumber: data.mobileNumber,
            },
        });
    logger.log(`USER - ${JSON.stringify(user)}`)

    if (user && verifyPassword(user, data.password)) {
        response.user = {
            id: user.id,
            mobileNumber: user.mobileNumber,
            firstName: user.firstName
        }
        response.session = await getSession(user);
    }
    else {
        response.status = false;
        response.message = "No user found!"
    }
    return {
        data: response,
        cache: { user }
    };
}
function verifyPassword(user, currentPassword) {
    var currentHax = crypto.createHmac('sha512', config.auth.secret).update(currentPassword).digest('hex');
    return user.password == currentHax;
}
function getSession(user) {
    const token = jwt.sign({ sub: user.mobileNumber }, config.auth.secret, { expiresIn: '7d' });
    var expiryDate = addDays(new Date(), 7);
    return {
        token: token,
        expiry: expiryDate
    }
}
function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}
module.exports = { login }