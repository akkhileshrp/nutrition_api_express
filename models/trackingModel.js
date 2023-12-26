const mongoose = require("mongoose");
require("dotenv").config();

const trackingSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: process.env.ref1,
        required: true
    },
    foodid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: process.env.ref2,
        required: true
    },
    eatenDate: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    }
}, {timestamps: true});

const trackingModel = mongoose.model(process.env.thirdModelName, trackingSchema);

module.exports = trackingModel;