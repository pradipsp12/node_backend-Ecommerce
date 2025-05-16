const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
//middleware 
app.use(cors({origin:'*'}));
app.use(bodyParser.json());

app.use('/image/category', express.static('public/category'));
app.use('/image/products', express.static('public/products'));
app.use('/image/poster', express.static('public/posters'));

const URL = process.env.MONGO_URL;
mongoose.connect(URL);
const db = mongoose.connection;

db.on('error', (error)=> console.log(error));
db.once('open', ()=>console.log('connection of database is successfull'));

//routes
app.use('/users', require('./routes/user'));
app.use('/categories', require('./routes/Category'));
app.use('/subCategory', require('./routes/SubCategory'));
app.use('/brand', require('./routes/brand'));
app.use('/variantTypes', require('./routes/variantType'));
app.use('/variants', require('./routes/variant'));
app.use('/products', require('./routes/product'));
app.use('/couponCodes', require('./routes/couponCode'));
app.use('/posters', require('./routes/poster'));
app.use('/orders', require('./routes/order'));
app.use('/payment', require('./routes/payment'));
app.use('/notification', require('./routes/notification'));


//global error handle

app.use((error,req,res,next)=>{
  res.status(500).json(
    {success:false, message: error.message, data:null}
  );
})

// check API directly in app.js
app.get('/', asyncHandler(async (req, res)=>{
  res.json({success: true, message:'API is working Perfectly', data:null}).status(200);
}));




app.listen(process.env.PORT || 3000, ()=>{
  console.log(`Server Running on Port ${process.env.PORT || 3000}`)
});