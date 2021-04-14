const Park = require("./models/park");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const parkJoiSchema = require('./utils/parkJoiSchema');
const reviewJoiSchema = require('./utils/reviewJoiSchema');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first.");
        return res.redirect("/login");
    }
    next();
}

//-- validations middleware with Joi --//
module.exports.validatePark = (req, res, next) => {
    //parkJoiSchema is the Joi schema for park validation
     const { error } = parkJoiSchema.validate(req.body);
     if(error){
         const msg = error.details.map(element => element.message).join(',')
         throw new ExpressError(msg, 400)
     } else {
         next();
     }
 }

//-- validation middleware for author of a PARK --//
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const park = await Park.findById(id);
    if(!park.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that");
        return res.redirect('/parks/${id}');
    }
    next();
 }

//-- validation middleware for author of a REVIEW --//
 module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that");
        return res.redirect('/parks/${id}');
    }
    next();
 }

 //-- validations middleware with Joi --//
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}