const User = require('./models/User.js');
const Role = require('./models/Role.js');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// secret key for jwt
const {secret} = require('./config.js');





generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}



class authController {
    async registration(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(500).json({message:"Something wrong with your login info!", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message:"This username is  already taken!"})
            }
            const hashedPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({username, password: hashedPassword, roles: [userRole.value]})
            await user.save();

            return res.json({message: "User has been successfully registered"})
        } catch (err) {
            console.log(err)
            res.status(400).json(err)

        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(400).json({message: "User with given name not found!"});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                res.status(400).json({message: "Invalid password!"})
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({token})
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json({users})
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    }
}
module.exports = new authController();