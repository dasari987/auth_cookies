var mongoose = require('mongoose');
var courseSchema = mongoose.Schema({
     course:String,
     price:String,
     duration:String,
     trainer:String,
     image:String,
     prerequisites:String,
     technologies:String
})

var Course = mongoose.model('Course',courseSchema)
module.exports=Course
