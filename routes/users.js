var mongoose = require("mongoose");
var passport= require("passport");
var plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/todo");

var userSchema=mongoose.Schema({
  username:String,
  email:String,
  contact:Number,
  password:String,
  work:[{title:String, disc:String,status:{type:Number,default:0}}]
})

userSchema.plugin(plm);
module.exports= mongoose.model("user",userSchema);