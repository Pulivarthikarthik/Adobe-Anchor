const { model } = require('mongoose');
const User = require('../models/user')

module.exports.renderSignupPage = (req,res)=>{
    res.render('users/signup.ejs');
}

//asks the user to signup
module.exports.signUp = async(req,res)=>{
    try{
let {firstname,lastname,username,email,password} = req.body;
const newUser = new User({firstname,lastname,username,email})
const registeredUser = await User.register(newUser,password)
//login() after signup it directly logins the user and adds the data to the req.user 

req.login(registeredUser,(err)=>{
if(err) {
    return next(err);
}    
 req.flash("success","Welcome to Wanderlust!!")  
 res.redirect('/listings');
})

console.log(registeredUser)
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/signup')
    }
}

module.exports.renderLoginPage = (req,res)=>{
res.render('users/login.ejs')    
}

module.exports.login = async(req,res)=>{//if true then we are redireced
        req.flash("success","Welcome to WanderLust..You are Set To Go!!"); 
        let redirectUrl = res.locals.redirectUrl || '/listings'// if we logout and login it will go to previous one or the listings pg 
        res.redirect(redirectUrl)
    
}

module.exports.logout = (req,res,next)=>{
 req.logout((err)=>{
    if(err){
        return next(err);
    }
 })    
 req.flash("success","You are logged Out Successfully");
  res.redirect('/listings')

}
