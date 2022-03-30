const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require("./app")




const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL.toString();

app.use(express.json());

// Enable body parser
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, async () => {
    try {
        await mongoose.connect(DATABASE_URL)
        console.log('=> Connected to MongoDB database')
    } catch (error) {
        console.log(" Couldn't connect to database ", error)
    }
    console.log(`=> listening on http://localhost:${PORT}`)
    console.log(`=> Mobius is online`)
    console.log(`=> See The README.md file to use API `)
});