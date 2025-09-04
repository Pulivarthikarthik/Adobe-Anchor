//in app.js the code is bulk so we defined the routes here by creating the express router
//all the routes are defined here and imported there 
//in the routes path no need to define starting(/listings) which is common in all 
//also instead of app we use 'router'

const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing.js')

const wrapAsync = require('../utils/wrapAsync.js');//used  to wrap the async errors like if price is no. but we have given str

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

const User = require('../models/user.js');
const listingControllers = require('../controllers/listings.js');

const multer = require('multer');

const {storage} = require('../cloudConfig.js')
const upload = multer({storage})
// here storage is in cloudinary and via multer we are storing data in starage file


//here we used router.route(path) with same path multiple HTTP requests are handled (put,get,post,del)
router.post('/search',wrapAsync(listingControllers.Inprogress))

// new form for the listings
// only listing is common but the other should be defined like new,edit,:id
//isAuthenticated() is a passport method checks if the user is loggedin or not
//if yes the he can add the listings  or else he must logged-In
 router.get('/new', isLoggedIn,  wrapAsync(listingControllers.renderNewForm))
//isLoggedIn checks if the user is loggedin for adding the new listing



//GET, POST
router.route('/')
    .get(listingControllers.index)
    .post(validateListing, isLoggedIn,upload.single('listing[image]'),wrapAsync(listingControllers.createListing));
//upload.single(imagename) is used to upload only single data
// index route, in this all the backend fnctionalities are in the controllers
//where index is the function name we have given with listingcontrollers
// for the better readability
//"validateListing" is passed as a middleware for server-side validation
//validatListing for the validation of the lists

//SHOW, UPDATE, DELETE
router.route('/:id')
   .get( wrapAsync(listingControllers.showListing))
   .put( isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), wrapAsync(listingControllers.updateListing))
   .delete( isLoggedIn, isOwner,  wrapAsync(listingControllers.destroyListing))

   
//show route when we click on specific title we get the details of that specific one
// if we want a specfic one then we have to use the middleware which parse the data it is at the top(urlencoded)
// only listing is common but the other should be defined like new,edit,:id
//isLoggedIn checks whether the user is loggedin or not and isOwner is whether the owner or not
//both are used as the middlewares
// only listing is common but the other should be defined like new,edit,:id




// the new and edit has different paths so we havent used router.route()


 
 
 
  
// edit route
// only listing is common but the other should be defined like new,edit,:id
router.get('/:id/edit', isLoggedIn, isOwner,  wrapAsync(listingControllers.renderEditForm))

  

 

module.exports = router;