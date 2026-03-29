
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose')
const express = require('express')
const Booking = require('./models/Bookings')



const app = express()
const api_url = process.env.API_URL
const uri = process.env.URI;
const port = process.env.PORT


async function run() {

  mongoose.connect(uri).then((res) => {
    console.log('You have connected to the database')
    app.listen(port)
  }).catch((err) => {
    console.log(err)
  })

  // The MongoClient is the object that references the connection to our
  // datastore (Atlas, for example)
  const client = new MongoClient(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await client.connect();

  // Provide the name of the database and collection you want to use.
  // If the database and/or collection do not exist, the driver and Atlas
  // will create them automatically when you first write data.
  const dbName = "BookingsDB";
  const collectionName = "Bookings";

  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collection = database.collection(collectionName);


  // Make sure to call close() on your client to perform cleanup operations
  await client.close();

// Create a new booking route
app.post('/create-booking', (req, res) => {
  const data = req.body; // Use req.body to access the request body

  Booking.save(data)
    .then((result) => {
      res.send(result);
      console.log('Booking Successful')
    })
    .catch((err) => {
      // Handle any errors that occurred during the save operation
      console.error(err);
      res.status(500).send('An error occurred while saving the booking.');
    });
});


app.get('/all-bookings', (req, res) => {
  // Gets all the Bookings in the database
  Booking.find().then((result) => {

  }).catch((err) => {
    console.log(err)
  })
})
}
run().catch(console.dir);