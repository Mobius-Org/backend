const fs = require("fs");
const upload = require("../middlewares/multer");
const AppError = require("../errors/appError");
const catchAsync = require("../utils/catchAsync");
const StudentContent = require("../model/studentContentModel")