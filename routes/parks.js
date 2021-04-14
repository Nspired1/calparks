const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Park = require("../models/park");
const { isLoggedIn, isAuthor, validatePark } = require("../middleware");
const parks = require('../controllers/parks');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//note: route paths begin with /parks. The prefix for the route path is in a variable (parksRoutes) 
// in the app.js file

//==== GET all parks, SHOW ALL =====//
// POST route to CREATE park
router.route('/')
    .get(catchAsync(parks.index))
    .post(isLoggedIn, upload.array('image'), validatePark, catchAsync(parks.createNewPark))
   
//==== create NEW park ======//
router.get('/new', isLoggedIn, parks.renderNewForm)

//==== GET one park to SHOW, PUT route for edit, DELETE route for DESTROY
router.route('/:id')
    .get(catchAsync(parks.showPark))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePark, catchAsync(parks.editPark))
    .delete(isLoggedIn, isAuthor, catchAsync(parks.deletePark))

// GET route for EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(parks.renderEditParkForm))

module.exports = router;