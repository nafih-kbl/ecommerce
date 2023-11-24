const category=require("../models/prodCategoryModel");
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const createCategory=asyncHandler(async(req,res)=>{
    try {
       const newCategory= await category.create(req.body);
       res.json(newCategory)
        
    } catch (error) {
        throw new Error(error)
    }
});

const updateCategory=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const updatedCategory=await category.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
});

const getCategory=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
       const Category=await category.findById(id);
        res.json(Category)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCategories=asyncHandler(async(req,res)=>{
    try {
        const allCategories=await category.find();
        res.json(allCategories)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteCategory=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const deletedCategory=await category.findByIdAndDelete(id);
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error)
    }
});


module.exports={
    createCategory,
    updateCategory,
    getCategory,
    getAllCategories,
    deleteCategory
}