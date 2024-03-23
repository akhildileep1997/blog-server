const mongoose = require('mongoose')

const DB = process.env.Mongo_Url

mongoose.connect((DB)).then(() => {
    console.log('Database connection established successfully');
}).catch((error) => {
    console.log(`Database connection failed due to ${error}`);
})
