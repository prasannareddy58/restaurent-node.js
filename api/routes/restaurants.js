// Import required modules and libraries
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Restaurant = require("../models/restaurant");

// Define a GET request handler for the root path ("/")
router.get('/', (req, res, next) => {
    // Use the restaurent model to find restaurents in the database
    Restaurant.find()
    .then((restaurants) => {
        // Respond with a JSON object containing the list of restaurents
        res.json(restaurants);
    })
    .catch((error) => {
        // If there's an error, respond with a 500 (Internal Server Error) status code
        // and an error message as a JSON object
        res.status(500).json({ 
            error: 'Failed to retrieve restaurants'
         });
    });
});

// Define a POST request handler for the root path ("/")
router.post('/', (req, res, next) => {
    // Extract the request data from the request body
    const data = req.body;
  
    // Log the incoming data for debugging purposes
    console.log('Request data:', data);
  
    // Create a new 'Restaurent' instance with data from the request body
    const restaurants = new Restaurant({
      Name: req.body.Name,
      mobileNo: req.body.mobileNo,
      email: req.body.email,
      city: req.body.city,
      restaurantname: req.body.restaurantname,
      message: req.body.message,
      paymentmode: req.body.paymentmode
      
    });
  
    // Save the restaurent to the database
    restaurants
      .save()
      .then(result => {
        // Log the saved  data for debugging purposes
        console.log(result);
  
        // Send a response with a 201 (Created) status code and a JSON object containing
        // a success message and information about the created restaurant, including a URL to access it
        res.status(201).json({
          message: "restaurant created successfully",
          createdRestaurant: {
            // Extract specific fields from the result
            Name: result.Name,
            mobileNo: result.mobileNo,
            email: result.email,
            city: result.city,
            restaurantname: result.restaurantname,
            message: result.message,
            paymentmode:result.paymentmode,
            _id: result._id,
            request: {
              type: 'GET',
              url: "http://localhost:3000/restaurants/" + result._id
            }
          }
        });
      })
      .catch(err => {
        // If there's an error during the saving process, log the error and send a 500 (Internal Server Error) response
        console.log(err);
        res.status(500).json({
          error: 'Failed to create restaurant data'
        });
      });
  });

  // Define a GET request handler for a route with a dynamic parameter ':id'
router.get('/:id', (req, res, next) => {
    // Extract the 'id' parameter from the URL
    const restaurantId = req.params.id;

    // Use the restuarent model to find a restaurant by their ID
    Restaurant.findById(restaurantId)
        .then((restaurant) => {
            // Check if a restuarent with the specified ID was found
            if (!restaurant) {
                // If not found, respond with a 404 (Not Found) status and an error message
                return res.status(404).json({ 
                    error: 'restaurant not found' 
                });
            }
            // If found, respond with the restuarent data as a JSON response
            res.json(restaurant);
        })
        .catch((error) => {
            // If there's an error during the query or processing, respond with a 500 (Internal Server Error) status
            // and an error message
            res.status(500).json({
                error: 'Failed to retrieve restaurant'
            });
        });
});

// Define a PATCH request handler for a route with a dynamic parameter ':id'
router.patch('/restaurant/:id', (req, res, next) => {
    // Extract the 'id' parameter from the URL
    const id = req.params.id;

    // Create an object 'updatedRestuarent' to store the updated fields from the request body
    const updatedRestaurant = {
        // Extracting updated fields from the request body
        Name: req.body.Name,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        city: req.body.city,
        restaurantname: req.body.restaurantname,
        message: req.body.message,
        paymentmode: req.body.paymentmode,
    };

    // Finding and updating the restaurant by ID using 'Restuarent.findByIdAndUpdate'
    // This method only updates the fields that are provided in 'updatedRestuarent'
    Restaurant.findByIdAndUpdate(id, updatedRestaurant, { new: true }) // 'new: true' returns the updated restuarent data
        .then(result => {
            console.log(result); // Logging the updated restuarent data
            // Sending a response with the updated restuarent data and a URL to access it
            res.status(200).json({
                message: 'restaurant updated successfully',
                updatedRestaurant: {
                    Name: result.Name, // Use the updated result data
                    mobileNo: result.mobileNo,
                    email: result.email,
                    city: result.city,
                    restaurantname: result.restaurantname,
                    message: result.message,
                    paymentmode: result.paymentmode,
                    _id: id, // Use the original ID from the request
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/restaurants/'+id
                }
            }
            });
        })
        .catch(err => {
            console.log(err); // Logging any errors
            res.status(500).json({
                error: 'Failed to update restaurant'
            });
        });
});

// Define a DELETE request handler for a route with a dynamic parameter ':restuarentId'
router.delete('/:restaurantId', (req, res, next) => {
    // Extract the 'restaurantid' parameter from the URL
    const id = req.params.restaurantId;

    // Use the 'Restuarent' model to find and delete the restaurant by ID
    Restaurant.findOneAndDelete({ _id: id })
        .exec()
        .then(result => {
            // Respond with a 200 (OK) status code and a JSON object indicating successful deletion
            res.status(200).json({
                message: 'Deleted restaurant',
                request: {
                    type: 'POST', // Provide information for creating a new member for restuarent
                    url: 'http://localhost:3000/restaurants', // URL for creating a new  registration restuarent
                    body: {
                        Name: 'String',
                        mobileNo: 'Number',
                        email: 'String',
                        city: 'String',
                        restaurantname: 'Number',
                        message: 'String',
                        paymentmode: 'String'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err); // Logging any errors
            // Respond with a 500 (Internal Server Error) status code and an error message
            res.status(500).json({
                error: 'Failed to delete restaurant'
            });
        });
});

module.exports = router; // Export the router for use in other parts of the application