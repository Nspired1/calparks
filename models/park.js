const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ImageSchema is a virtual schema
// virtual properties do NOT need to be stored in the database
const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    this.url.replace('/upload/', '/upload/w_200')
});

// opts, short for options, enables the use of virtual properties in Mongo. Declaring the opts variable here
// and inserted into new Schema after the main object is defined.
const opts = { toJSON: { virtuals: true } };

const ParkSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
}, opts);

ParkSchema.virtual('properties.popUpText').get(function(){
    return `<a href="/parks/${this._id}">${this.title}</a>
    <p> ${this.description.substring(0,20)}...</p>
    `
});

module.exports = mongoose.model('Park', ParkSchema);