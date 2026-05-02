const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["rider","driver"],
        required:true
    },
    licenseNumber:{
        type:String,
    },
    vehicleNumber:{
        type:String
    },
    vehicleType:{
        type:String
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;