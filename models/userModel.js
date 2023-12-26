const mongoose = require("mongoose");
require("dotenv").config();

// connecting the db
mongoose.connect(process.env.connectionURL)
.then(() => {
    console.log("Database connected successfully")
})
.catch((err) => {
    console.log(err);
})

// creating the user schema
const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: [true, "Name is mandatory"]
    },
    email: {
        type:String,
        required: [true, "E-Mail is mandatory"]
    },
    password: {
        type:String,
        required: [true, "Password is mandatory"]
    },
    age: {
        type:Number,
        required: [true, "Age is mandatory"],
        min: [12, "Minimum age is 12"]
    }
},{timestamps:true});

// creating the userModel
const userModel = mongoose.model(process.env.modelName, userSchema);

module.exports = userModel;