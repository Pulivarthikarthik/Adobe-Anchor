const Listing = require('./models/Listing')
const Review  = require('./models/review.js')

const ExpressError = require('./utils/ExpressError.js')

const { listingSchema,reviewSchema } = require('./schema.js');
 
 



module.exports.isLoggedIn = (req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;// here we are saving the orginal-url in sessions
// because when we click on add new listings without login it asks for login after login it should come to 
//the page where we are (add new listings) so we save the url and store it in res.locals 
        req.flash('error','User must be logged-In');
        return res.redirect('/login');
    }
    next();
}
//checks if the user is loggedin or not and isAuthenticated() is a passport method 
// checks whether the user is authenticated i.e., loggedin or not

module.exports.saveRedirectUrl = (req,res,next)=>{
if(req.session.redirectUrl){
 res.locals.redirectUrl = req.session.redirectUrl;

}
next();
}
// for saving the redirectUrl(originalUrl) we used res.locals to store the data 
//if we logout then the data
//  in the sessions will be deleted but we are storing the data in the locals so data wil not be deleted


//for editing the listing using a middleware for authnetication
    // authorization for the listings

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;

    // authorization for the listings
    let listing = await Listing.findById(id)
     if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner,Access denied");
      return res.redirect(`/listings/${id}`)

     }
     next();
    }


    // it is for the server-side validation which displays the error
    module.exports.validateListing = (req, res, next) => {   
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//for validating the review Schema

module.exports.validateReview = async(req, res, next) => {  // it is for the server-side validation which displays the error
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// to delete the review user must be the owner of that

module.exports.isReviewAuthor = async (req,res,next)=>{
    let { reviewId,id } = req.params;

    // authorization for the review
    let review = await Review.findById(reviewId)
     if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the author of the review ,Access denied");
      return res.redirect(`/listings/${id}`)

     }
     next();
    }