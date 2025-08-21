const { required } = require('joi')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
 

const userSchema = new mongoose.Schema({
    firstname: {type:String, required:true},
    lastname:  {type:String, required:true},
    
    email:{
        type:String,
        require:true
    },
        username:  { type:String, required:true, unique:true }   

})

userSchema.plugin(passportLocalMongoose)
//plugin adds the addtional functions to mongoose and it is a built-in.

//passportlocalmongoose by default gives the username and the password with hashing and salting
 

module.exports = mongoose.model('User',userSchema)
//User = model and collectionn  will be users