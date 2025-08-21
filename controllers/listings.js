// controllers is like handling the core backend functionalities(index,new,post,update,delete,etc.,)
// it also keeps the other files in readability for understanding
 const { x } = require('joi');
const Listing = require('../models/Listing');
 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 //geoCoding is used to convert the places into latitude and longitude
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken:  mapToken });



// for show the index i.e,. all the listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});  // Listing is the model(Schema)
    res.render("listings/index.ejs", { allListings })  // here index.ejs is under listings which is under views
}


// for rendering the new form
module.exports.renderNewForm = async(req, res) => {
    res.render('listings/new.ejs')
}

//For adding the new listing 
//here wrapAsyc function is used
//req.flash(key:value) here after adding the listing it display the msg as a flash(pop-up) and vanishes
//here key(Done) is important


module.exports. createListing =   async (req, res, next) => {

    //it gives the co-ordinates it is a map-box library 
 let response =  await geocodingClient.forwardGeocode({
  query:  req.body.listing.location,
  // here we are retriving the coordinates of the respective place which we have given
  limit: 1
})
  .send()
 

      let url  = req.file.path;//we used these both to extract both url and filename to save in mongo
      let filename = req.file.filename

    const newListing = new Listing(req.body.listing)// in this listing at last because it has the values i.e., keys(new.ejs)
    // Listing is the model

    newListing.owner = req.user._id;//giving the owner to newListing based on id
     

    newListing.image = {url,filename} // adding these two in newlisting

    newListing.geometry = response.body.features[0].geometry
    //it gives the coordinates stored in features > body and these are stored in response of the newListing
 

    let savedlisting = await newListing.save();  // saving
    console.log(savedlisting)
    req.flash("success", "Listing has been added!!")
    res.redirect('/listings');
}

// for showing the paticular lisitng

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    listing = await Listing.findById(id).
        populate({
            path: "reviews",
            populate: { path: "author" } // here we are populating the author to see the author name in review box
        }).populate('owner');

    if (!listing) {
        req.flash("error", "Listing you are requested for doesn't exist")
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
}
// .populate('owner') it is used to show the owner on every listing same like populate(reviews)


//edit route
module.exports.renderEditForm =  async (req, res) => {
    let { id } = req.params;
    listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are requested for doesn't exist")
        return res.redirect('/listings');
    }
    let originalImageUrl  = listing.image.url
    originalImageUrl = originalImageUrl.replace('/upload/upload/w_250,')
    // it is a cloudinary parameter which adjust the size of the img in edit form by replacing the url of cloudinary
    res.render("listings/edit.ejs", { listing,originalImageUrl })
}

//update route
module.exports.updateListing =   async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //finding by id and updating by de-referencing the body by '...'
      
     if(typeof req.file !== "undefined"){
     let url  = req.file.path;//we used these both to extract both url and filename to save in mongo
      let filename = req.file.filename
      listing.image = {url,filename}
      await listing.save()
     }

    req.flash("success", "Listing has been Updated!!")

    res.redirect(`/listings/${id}`);
    //means after update it redirect to particular id(we are editing) not the all listings

} 

//delete route
module.exports.destroyListing =   async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    req.flash("success", "Deleted Succesfully!!")
    res.redirect('/listings');
} 