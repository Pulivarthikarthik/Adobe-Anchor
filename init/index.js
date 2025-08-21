const mongoose = require('mongoose');

const Listing = require('../models/Listing.js')

const intializedData = require('./data.js'); 





async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then((res)=>{
    console.log('connected to DB');
})
.catch((err)=>console.log(err))

const initDB = async () =>{
    await Listing.deleteMany({});  // delete previous un-wanted data

     intializedData.data = intializedData.data.map((obj)=>({...obj, owner:'68a5a30b524742179a701a6f'}))
     // we added owner to every listing by the owner's object id

    await Listing.insertMany(intializedData.data);//here data is the key in data.js 

    console.log('data was intialized');
    console.log(intializedData)
}

initDB(); // calling the function