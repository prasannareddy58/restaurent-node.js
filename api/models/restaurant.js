const mongoose = require('mongoose');

//Defining the restaurent schema
const restaurantSchema = new mongoose.Schema({
    //giving data to book demo
    Name: {
        type: String, required: true,
    },
    mobileNo: {
        type: Number, required: true,
    },
    email: {
        type: String, required: true,
    },
    city: {
         type: String, required: true,   
    },
    restaurantname: {
        type: String, required: true,
    },
    message: {
        type: String, required: true,
    },
    paymentmode:{
        type: String,
    },
});
 
//Creating the restuarent model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;