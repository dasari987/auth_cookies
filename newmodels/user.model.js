var mongoose = require("mongoose")
var userSchema = mongoose.Schema({
    firstname: String,
    username: String,
    email: String,
    password: String,
    courses: [String],
    purchases: [String]
})

var User = mongoose.model('User',userSchema)
module.exports = User


