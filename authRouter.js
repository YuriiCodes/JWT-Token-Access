const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware.js');


router.post('/registration', [
   check('username', "username can't be empty!").notEmpty(),
    check('password', "password must be longet than 4 digits and shorter than 10!").isLength({min: 4, max: 10})
], controller.registration)

router.post('/login', controller.login)

router.get('/users',authMiddleware, controller.getUsers)

module.exports = router;
