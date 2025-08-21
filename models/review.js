// it is for the reviews in a particular listing

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment:String,
    rating:
    { 
        type:Number,
        min:1,
        max:5,
    },
    createdAt:
    {
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }

})
// for model 
let Review = mongoose.model("Review",reviewSchema)

module.exports= Review