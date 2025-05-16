const mongoose = require('mongoose');


const subCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Name is required'],
        trim:true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Category id is required'],
        ref:'Category'
    } 
}, {timestamps: true});


const subCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = subCategory;