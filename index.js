const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
require("dotenv").config();

const app = express();
const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const trackingModel = require("./models/trackingModel");
const port = process.env.port;
const cors = require("cors");

app.use(express.json());
app.use(cors());
// creating the post request

app.post("/signup", (req, res) => {
    let user = req.body;
    userModel.findOne({ email: user.email })
    .then((existingUser) => {
        if(existingUser) {
            res.status(400).send({ message: "User already in use. Try to login" });
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if(!err)
                {
                    bcrypt.hash(user.password, salt, (err, hpass) => {
                        if(!err) 
                        {
                            user.password = hpass;
                            userModel.create(user)
                            .then((doc) => {
                                res.status(201).send({ message: "User registered successfully" })
                            })
                            .catch((err) => {
                                res.status(500).send({ message: "Internal Server error" });
                            })
                        }
                    })
                }
            })
        }
    })
    .catch((err) => res.status(500).send({ message: "Internal Server error" }));
})

// creating the login request
app.post("/login",(req, res) => {
    let userCred = req.body;
    userModel.findOne({ email: userCred.email })
    .then((user) => {
        if(user != null)
        {
            bcrypt.compare(userCred.password, user.password, (err, result) => {
                if(result === true)
                {
                    jwt.sign({ email: userCred.email}, process.env.secretKey, (err, token) => {
                        if(!err)
                        {
                            res.send({ message: "Login Successfull", token:token })
                        }
                        else
                        {
                            res.status(401).send({ message: "Error while generating token" })
                        }
                    })
                }
                else 
                {
                    res.status(404).send({ message: "Incorrect password" });
                }
            })
        }
        else
        {
            res.status(404).send({ message: "User not found" });
        }
    })
})

// endpoint to fetch all the food items
app.get("/foods", verifyToken, (req, res) => {
    foodModel.find()
    .then((document) => {
        res.send(document);
    })
    .catch((err) => {
        res.status(401).send({ message: "Error while fetching data" });
    })
})

// endpoints to search food by name
app.get("/foods/:name", verifyToken, (req, res) => {
    foodModel.find({ name: {$regex: req.params.name, $options: "i" }})
    .then((food) => {
        if(food.length!==0) {
            res.send(food);
        }
        else {
            res.status(404).send({ message: "Food not found. Check your food name properly!" });
        }
    })
    .catch((err) => {
        res.status(401).send({ message: "Error while fetching data" })
    })  
})

// creating the endpoint for tracking the food
app.post("/track", verifyToken, (req, res) => {
    let trackingData = req.body;
    trackingModel.create(trackingData)
    .then((data) => {
        res.status(201).send({ message: "User and Food data have been registered successfully." });
    })
    .catch((err) => {
        res.status(500).send({ message: "Some problem in fetching the data" });
    })
})

// creating the endpoint for fetching the user data and the food data
app.get("/track/:userid/:date", verifyToken, (req, res) => {
    let userid = req.params.userid;
    let date = new Date(req.params.date);
    let parsedDate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    trackingModel.find({ userid: userid, eatenDate: parsedDate }).populate("userid").populate("foodid")
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({ message: "Error while fetching the data" });
    })
})

// listening port
app.listen(port, (err) => {
    if(!err)
        console.log("Server is up and running");
    else
        console.log(err);
})