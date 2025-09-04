if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
//process.env means the current env file 
// console.log(process.env.SECRET)

const express = require('express');
const app = express()

const mongoose = require('mongoose');

const Listing = require('./models/Listing.js')

const cors = require('cors');
app.use(cors());
 


const path = require('path'); 

const methodOverride = require('method-override');

const wrapAsync = require('./utils/wrapAsync.js');//used  to wrap the async errors like if price is no. but we have given str

const ExpressError = require('./utils/ExpressError.js')

const ejsMate = require('ejs-mate'); // its for templates

const { listingSchema,reviewSchema } = require('./schema.js')

const Review = require('./models/review')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

const session = require('express-session') 
const MongoStore = require('connect-mongo');

const flash = require('connect-flash')


const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const { error } = require('console');

app.set("view engine", 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")));// for public files

app.use(express.urlencoded({ extended: true })) // its the middleware to parse the data
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);


const dbUrl = process.env.ATLAS_CONNECTION_STRING
async function main() {
    await mongoose.connect(dbUrl);
}
main().then((res) => {
    console.log('connected to DB');
})
    .catch((err) => console.log(err))

 
//********* **************

// same like sessionOptions we use MongoStore 

const store  = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{        // crypto is used to store sensitive information
        secret:process.env.SECRET
    },
    touchAfter:24*3600  //interval after updates 
})
store.on(error,()=>{
    console.log("Error in Mongo session Store",err)
})
//exress-sessions -> 1st i have written this one and after mongo store 

const sessionOptions = {
    store, // accessing from store
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    },
}
// 7days 24hrs 60mins 60secs 1000ms after this much time the cookie will be expired if not login by the user in session
//secret is given by us that can be anything.
//resave:Forces the session to be saved back to the session store.
//saveUninitialized:Forces a session that is "uninitialized" to be saved to the store(where session data is saved)

 

 app.use(session(sessionOptions))
 app.use(flash()) 
 //flash is used to display the temporary msg for the user(client-side) and vanishes after refresh(or for sometime)
 // it has the key:value pair used to store messages in sessions and available to the nxt rendered page


 app.use(passport.initialize());
 app.use(passport.session());
 //to use passport these both middlewares must be used
 
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
//LocalStrategy= passport-local and authenticate = login used for localstrategy and User = model
//serialize = store the data of the user in session and deserialize = remove the data from the session  

 

// app.get('/demo',async(req,res)=>{
//  let user1 = new User({
//     email:'user1@gmail.com',
//     username:'user'
//  })   
//  let RegisteredUser = await User.register(user1,"helloworld");
//  res.send(RegisteredUser);
// })
// here we tested the user with email and username via passport
//register(user,password,callback) "helloworld"=password,,user1 = user it cretaes a new user instance 



 app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.warning = req.flash("warning")
    res.locals.currUser = req.user;

    next();
 })
 //Done is the key in the flash at listing.js(post route) 
 //res.locals.Done(key) it extracts to ejs without filename
 //res.locals can be accessible to any EJS template



// this is single line is a middleware linking the  router file for the listing.js and review.js by the matched routes
// (/listings) is the common word in all routes so matched one is defined here from listings file and review file
// it is the link between the app.js and the listing.js,review.js(router)

app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)



//TODO
//*********************** */



//here we selected for all paths,if the path is not correct then new expresserror is raised with statuscode and msg

// app.all('*',(req,res,next)=>{
//     next(new ExpressError(404,'Page Not Found!!'))
// })
// here the code and the message are decoded and sent
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.render('error.ejs', { err });


})


app.listen(8086, (req, res) => {
    console.log('server is running in 8086');
})