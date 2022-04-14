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