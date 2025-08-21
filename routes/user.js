const express = require('express');
const wrapAsync = require('../utils/wrapAsync');//used  to wrap the async errors like if price is no. but we have given str

const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/users.js')


/////SIGNUP PAGE
router.route('/signup')
    .get(userController.renderSignupPage)
    .post(wrapAsync( userController.signUp))
 
//here we named userController with function rendersignuppg which has the logic in the controller
//asks the user to signup
  

//LOGIN

//here it gives the login page
//asks the user to login

router.route('/login')
   .get( userController.renderLoginPage)
   .post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',
    failureFlash:true}) // it falshes a msg
    , userController.login)
//passport.authenticate("localStrategy,options") if fails it checks
//it is a middleware which checks with the DB if the username and password are matched
// we use saveRedirectUrl because when we click on add new listings without login it asks for login after login it should come to 
//the page where we were (add new listings) so we save the url and store it in res.locals 


//TODO:     LOGOUT


router.get('/logout', userController.logout)
// req.logout() is a passport method which makes user to go out of the session and terminates the login session
//if any err is present it goes to next() one with the err if no err the user will be loggedout

module.exports = router
