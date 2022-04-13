const bcrypt = require('bcrypt');

exports.hash = (password) => {
    let saltRounds = 10
    return bcrypt.hash(password, saltRounds);
};

exports.compare = (inPassword, basePassword) => {
    return bcrypt.compare(inPassword, basePassword);
};