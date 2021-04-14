const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user');
const usersController = require('../controllers/users');

//=== SHOW register form with GET request ===//
//==== register new user with POST request ===//
router.route('/register')
    .get(usersController.renderRegisterForm)
    .post(catchAsync(usersController.register))

//=== SHOW login form with GET request ===//
//===  login users with POST request ===//
router.route('/login')
.get(usersController.renderLoginForm)
.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), usersController.login )

//=== logout users ===//
router.get('/logout', usersController.logout)

module.exports = router;
