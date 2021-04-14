//seed file only run to setup test data. Deletes data first, then populates with random places
const mongoose = require('mongoose');
const Park = require("../models/park");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

mongoose.connect('mongodb://localhost:27017/calparks', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const databaseLink = mongoose.connection;
databaseLink.on("error", console.error.bind(console, "connection error:"));
databaseLink.once("open", ()=> {
    console.log("Database Connected from Seed Folder!");
});

//function that generates a random number from an array. In this case the descriptors and places array.
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    //delete all data in database, then reseeds database with randomly generated location (cities) and names
    //cities names uses data from cities.js file.
    //park names uses data from seedHelpers.js file.
    await Park.deleteMany({});
    for (let i = 0; i < 17; i++){
        const randomNumber = Math.floor(Math.random() * 25);
        const park = new Park({
            author: '604282b58ec4f54ac8419f9e',
            location: `${cities[randomNumber].city}, ${cities[randomNumber].state}` ,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `hard coded loren ipsum tranquility, human foresight, scenic vistas `
        })
        await park.save();
    }
}

//invoke database seeding function, then close connection.
seedDB().then( ()=> {
    mongoose.connection.close();
}); 

