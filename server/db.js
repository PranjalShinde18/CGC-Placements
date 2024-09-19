import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();


const mongoURL = "mongodb://localhost:27017/cgc";
// const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {})

const db = mongoose.connection;

db.on('connected', function () {
    console.log('Connected to MongoDB server \n');
});

db.on('disconnected', function () {
    console.log('Disconnected from MongoDB\n');
});

db.on('error', function (err) {
    console.log('Error connecting to MongoDB:' + err);
});

export default db;