const redirectURI = "/auth/callback";
const axios = require('axios');
const { google } = require('googleapis');
const User = require('../model/userModel');
const AppError = require('../errors/appError');

// setup environment
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
   "http://localhost:3002/mbApi/v1/google/auth/callback"
)

// `${process.env.TREEN_SERVER}/${redirectURI}`,
exports.googleAuth = (req, res) => {
    // set Auth scopes
    scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ];

    // generate auth url
    let result = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
    })
    // redirect to auth url
    res.redirect(result);
}

exports.getAuthCode = async(req, res, next) => {
    // get code from url
    const code = req.query.code.toString();
    // extract token from code
    const { tokens } = await oauth2Client.getToken(code);
    // make request to googleapi with code 
    const user = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.id_token}`,
                },
            },
        )
        .then(res => res.data)
            .catch(error => {
                return next( new AppError(error.message, 400) );
        });

    // extract information from google authenticated user 
    const { id, email, name } = user;
    console.log(user);
    // find user in database
    const loginUser = await User.find({ email });

    // set request body
     req.body = {
        email,
        password: process.env.DEFAULT_PASSWORD
    }
    // if user exists
    if(loginUser.length > 0) {
       next();
    }
    // if user doesn't exist create user
    const storedUser = new User();
    storedUser.setPassword(process.env.DEFAULT_PASSWORD)
    storedUser.set({ name, email, favColor: "Blue", age: 7 })
    await storedUser.save();
    next();
}



