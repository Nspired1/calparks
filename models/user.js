const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// don't need username and password for User Schema because
// plugin for passportLocalMongoose saves username and password.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);