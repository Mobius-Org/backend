const cors                 = require('cors');
const morgan               = require('morgan');
const express              = require('express');
const AppError             = require('./errors/appError');
const { cloudinaryConfig } = require('./utils/cloudinary');
const appErrorHandler      = require('./errors/app_error_handler');

// Initalize app
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable morgan
app.use(morgan('dev'));

// config cloudinary
app.use('*', cloudinaryConfig);

//ROUTES


app.get('/', (req, res) =>{
  res.status(200).send("Welcome To The Home Page Of MOBIUS Api!")
});



app.all('**', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(appErrorHandler);

module.exports = app;
