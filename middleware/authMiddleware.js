const jwt = require('jsonwebtoken');
const {secret} = require('../config.js')


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        //Because JWT token is usually in format Bearer TOKEN, and we need only token.
        const token = req.headers.authorization.split(' ')[1];
        if( !token ){
            res.status(403).json({message:"User is not authorized"})
        }
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    } catch(err) {
        console.log(err)
        res.status(403).json({message:"User is not authorized", err})
    }
}