const express = require('express');
const router = express.Router({mergeParams:true})
/* here mergeParams is for Preserve the req.params values from the parent router.
  If the parent and the child have conflicting param names(means the id in the app.js i.e.,
 app.use('/listings/:id/reviews',reviews)
   for 
  reviews the id is not reachable to the review.js file ), 
   the child’s value take precedence.*/
   //so we used mergeParams

const wrapAsync = require('../utils/wrapAsync.js');//used  to wrap the async errors like if price is no. but we have given str
const ExpressError = require('../utils/ExpressError.js')
const Review = require('../models/review')
const Listing = require('../models/Listing.js')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js')

const reviewController = require('../controllers/reviews.js')



 


//reviews route posting the data
//post route
router.post('/',isLoggedIn,validateReview, wrapAsync(reviewController.createReview))
//reviewSchema is passed as a middleware but it is an server-side validation same like listingSchema both are same
//here reviewController.createReview is a controller where we write the logic of adding the review

//delete Route for reviews
router.delete('/:reviewId',isReviewAuthor, wrapAsync(reviewController.destroyReview))
//isReviewAuthor is a middleware

module.exports = router