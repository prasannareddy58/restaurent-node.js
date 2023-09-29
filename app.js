const express=require('express');
const app=express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const restaurantRoutes = require('./api/routes/restaurants');


mongoose.connect("mongodb+srv://node-rest-shop:node_js@node-rest-shop.vcxn1av.mongodb.net/?retryWrites=true&w=majority");


mongoose.Promise = global.Promise;



app.use(morgan('dev'));

// app.get('/',(req,res,next) => {
//     res.json({
//         name:"harry",
//         message:"hii good morning"
//     });


// })
 

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Acess-Control-ALLOW-Orgin","*");
    res.header("Acess-Control-ALLOW-Headers","Origin,X-Requested-Width,Content-Type,Accept,Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

//routes which should handle requests

app.use('/restaurants',restaurantRoutes);


app.use((req,res,next)=> {
    const error =new Error('not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });

});

module.exports = app;