const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/subCategory');
const Product = require('../models/product');
const Brand = require('../models/brand');


// find all subCategory

router.get('/', asyncHandler(async(req, res)=>{
    try {

        const subCategories = await SubCategory.find().populate('categoryId').sort({'categoryId': 1});
        res.json({ success: true, message: "Sub-categories retrieved successfully.", data: subCategories });

        
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}))

// Get a sub-category by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const subCategoryID = req.params.id;
        const subCategory = await SubCategory.findById(subCategoryID).populate('categoryId');
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found." });
        }
        res.json({ success: true, message: "Sub-category retrieved successfully.", data: subCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// create a new subCategory


router.post('/', asyncHandler(async(req,res)=>{

    const {name, categoryId} = req.body;
    try {
        if(!name || !categoryId){
            return res.status(400).json({success: false, message: 'Category id is required'});

        }
        const subCategory = new SubCategory({
            name,
            categoryId
        })
        const newSubCategory = await subCategory.save();
        if(!newSubCategory){
            return res.status(400).json({success: false, message: 'Category missmatch'});

        }
        res.json({success: true, message: 'SubCategory created successfully', data: null});
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }

}));

//update subcategory

router.put('/:id', asyncHandler(async(req, res)=>{
    const subCategoryId = req.params.id;
    const {name, categoryId} = req.body;
    try {
        
        if(!name || !categoryId){
            return res.status(400).json({success: false, message: 'Name and Category required'});
        }
        const updateSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId, {name, categoryId }, {new:true});
        if(!updateSubCategory){
            return res.status(400).json({success: false, message: 'SubCategory not found'});
        }
        res.json({success: true, message: 'SubCategory updated successfully', data:  updateSubCategory});

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}))
// delete subcategory

router.delete('/:id', asyncHandler(async(req, res)=>{
        const subCategoryID = req.params.id;
        try {
             // Check if any brand is associated with the sub-category
        const brandCount = await Brand.countDocuments({ subcategoryId: subCategoryID });
        if (brandCount > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete sub-category. It is associated with one or more brands." });
        }

        // Check if any products reference this sub-category
        const products = await Product.find({ proSubCategoryId: subCategoryID });
        if (products.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete sub-category. Products are referencing it." });
        }
            const deleteSubCategory = await SubCategory.findByIdAndDelete(subCategoryID);
            if(!deleteSubCategory){
               return res.status(400).json({ success: false, message: 'SubCategory not found' });
            }
            res.json({success:true, message:'SubCategory Deleted Successfully'});
        } catch (error) {
            console.error("Error creating category:", error);
            res.status(500).json({ success: false, message: error.message });
        }
}))

module.exports = router;