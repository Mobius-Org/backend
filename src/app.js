const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const AppError = require("./errors/appError");
const appErrorHandler = require("./errors/app_error_handler");

// Initalize app
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable cors for specific route
const allowedOrigins = [
  "https://mobius-dev-test.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin))
    res.setHeader("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", true);
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// enable morgan
app.use(morgan("dev"));

//ROUTES
app.use("/mbApi/v1/auth", require("./routes/authRoute"));
app.use("/mbApi/v1/google", require("./routes/googleAuthRoute"));
app.use("/course", require("./routes/courseRoute"));

app.get("/", (req, res) => {
  res.status(200).send("Welcome To The Home Of MOBIUS Api!");
});

app.all("**", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(appErrorHandler);

module.exports = app;
