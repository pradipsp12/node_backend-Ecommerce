const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { uploadCategory } = require('../UploadFile');
const multer = require('multer');
const Category = require('../models/category');
const subCategory = require('../models/subCategory');
const Product = require('../models/product');
const dotenv = require('dotenv');
dotenv.config();


//fetch all Category

router.get('/', asyncHandler(async(req, res) =>{
    try {
        const categories = await Category.find();
        res.json({success : true, message: 'All Category fetch successfully', data: categories});

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}))
//fetch single category

router.get('/:id', asyncHandler(async(req, res) =>{
    const categoryId = req.params.id;
    try {
        const categories = await Category.findById(categoryId);
        res.json({success : true, message: 'Category fetch successfully', data: categories});

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}))
// create a  new category 

router.post('/', asyncHandler(async(req, res) => {
    try {
        uploadCategory.single('img')(req, res, async function (err) {
            if(err instanceof multer.MulterError){
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Add category: ${err}`);
                return res.json({ success: false, message: err }).status(400);
            } else if (err) {
                console.log(`Add category without multer: ${err}`);
                return res.json({ success: false, message: err }).status(400);
            }

            const {name} = req.body;
            let imageUrl = '';
            if(req.file){
                imageUrl = `${process.env.HOST}/image/category/${req.file.filename}`;
            }
            console.log('url ', req.file)

            if (!name) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                const newCategory = new Category({
                    name: name,
                    image: imageUrl
                });
                const response = await newCategory.save();
                res.json({ success: true, message: "Category created successfully.", data: null });
            } catch (error) {
                console.error("Error creating category:", error);
                res.status(500).json({ success: false, message: error.message });
            }

        })
    } catch (err) {
        console.log(`Error creating category: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));


// update category
router.put('/:id', asyncHandler(async(req, res)=>{
    const categoryId = req.params.id;

    try {
        uploadCategory.single('img')(req, res, async function (err){
            if(err instanceof multer.MulterError){
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                } else if(err){
                    console.log(`Add category: ${err}`);
                    return res.json({ success: false, message: err }).status(400);
                }
            }


            const {name} = req.body;
            let imageUrl = req.body.image;
            if(req.file){
                imageUrl = `${process.env.HOST}/image/category/${req.file.filename}`;
            }

            if(!name || !imageUrl){
                return res.status(400).json({ success: false, message: "Name and image are required." });
            }

            try {
                const categoryUpdate = await Category.findByIdAndUpdate(categoryId, {name:name, image:imageUrl}, {new:true});
                if(!categoryUpdate){
                    return res.status(404).json({ success: false, message: "Category not found." });
                }
                res.json({success: true, message: 'Category updated successfully', data:null});
            } catch (err) {
                console.log(`Error creating category: ${err.message}`);
                return res.status(500).json({ success: false, message: err.message });
            }
        });
    } catch (error) {
        console.log(`Error creating category: ${error.message}`);
        return res.status(500).json({ success: false, message: error.message });
    }
}));

//delete category

router.delete('/:id', asyncHandler(async(req, res)=>{
    const categoryId = req.params.id;

    try {
        // Check if any subcategories reference this category
        const subcategories = await subCategory.find({ categoryId: categoryId });
        if (subcategories.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category. Subcategories are referencing it." });
        }

        // Check if any products reference this category
        const products = await Product.find({ proCategoryId: categoryId });

        if (products.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category. Products are referencing it." });
        }
        const deleteCategory = await Category.findByIdAndDelete(categoryId);
        if(!deleteCategory){
            return res.status(500).json({success: false, message: 'Category not found'});
        }
        res.json({success: true, message : 'Category deleted successfully'});

    } catch (error) {
        console.log(`Error creating category: ${error.message}`);
        return res.status(500).json({ success: false, message: error.message });
    }
}))


module.exports = router;