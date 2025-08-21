// it gives the particular list model format

const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // storing mongoose.schema in Schema

const Review = require('./review')

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
     url:String,
     filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }

  ],
  // owner is added to every list for the authorization
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
    
  },
  //it is geojson used to store the coordinates
  geometry:{
     type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: false
    },
    coordinates: {
      type: [Number],
      required: true
   }
}
});

//after deleting the listing the reviews should also be deleted so findOneAndDelete
//middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
 await Review.deleteMany({reviews:{$in:listing.reviews}})  
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
