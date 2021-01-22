var router = require('express').Router();
//LOGIN , REGISTER, FORGOT PASSWORD

router.use('/auth', require('./auth'));

module.exports = router