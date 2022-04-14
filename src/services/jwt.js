const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = ( userData ) => {
    return jwt.sign( userData, process.env.JWT_SECRET_KEY, { expiresIn: 24 * 60 * 60 * 1000 } );
}

exports.decode = ( token ) => {
    return jwt.verify( token, process.env.JWT_SECRET_KEY, ( err, decoded )=>{
        if (err) return null;
        else return decoded;
    } );
}

exports.createSendToken = (user, status, res) => {
    let token = user.genJwt()
    user = user.toObject()
    //user.token = token
    delete user.password
    delete user.lastLogoutTime
    delete user.lastLoginTime
    res.status(status).send({
        status: "success",
        message: `Hello ${user.name}! Welcome To Mobius!`,
        user
    });
};