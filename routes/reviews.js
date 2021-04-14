const express = require('express');
const router = express.Router({mergeParams: true});
const Park = require("../models/park");
const Review = require("../models/review");
const reviewJoiSchema = require('../utils/reviewJoiSchema');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviewsController = require('../controllers/reviews');

//NOTE: for router variable mergeParams needs to be set to "true" b/c express router likes to keep
// params SEPARATE. routers get separate params, so when calling a review id from a park, express returns
// null. 

// POST route for a review; create a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview )
);

// DELETE route for a review; when a park is deleted reviews are also deleted (like cascade delete for NoSQL)
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync( reviewsController.deleteReview))

module.exports = router;