var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    title: String,
    date: {type: Date, default: Date.now},
    content: String,
    img: String
});

module.exports = mongoose.model("Event", eventSchema);
