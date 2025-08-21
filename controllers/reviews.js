const Listing = require('../models/Listing')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id)// ':' then req.params must be used to extract the id
    let newReview = new Review(req.body.review)   //Review=model and Listing = model 
    
    newReview.author = req.user._id // getting the author when giving a review
    //we have to store this newReview in the particular listing where we have created an "array" to store newReview
    listing.reviews.push(newReview);//here reviews is the array where we have to store


    await newReview.save()
    await listing.save()
    req.flash("success","New Review Created!!")
     
    res.redirect(`/listings/${listing._id}`) //_id ==req.params

}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    //here pull is used to extrct the id from the reviews array
    await Listing.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted successfully!!")

    res.redirect(`/listings/${id}`)
}