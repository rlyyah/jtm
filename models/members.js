var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
    name: String,
    img: {type: String, default: 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100'}
});

module.exports = mongoose.model("Member", memberSchema);