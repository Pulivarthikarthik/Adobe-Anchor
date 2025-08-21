// it is a tool where we define the server side validation schema that should be valid

const Joi = require('joi');
// and it is for the listing validation at server-side
module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().required().allow("",null),
    
}).required()//means the field should be filled
})

// server-side validation for the reviews

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
}) 
//.prefs({ convert: true }) it Automatically converts "3" to 3 or any string to number