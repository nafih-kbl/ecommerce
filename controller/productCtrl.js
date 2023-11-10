const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validateMongodbId');
const slugify=require('slugify')


const createProduct = asyncHandler(async (req, res) => {
    try {
        req.body.slug=slugify(req.body.title)
        const newProduct=await Product.create(req.body);
        res.json(newProduct)
        
    } catch (error) {
        throw new Error(error);
    }
});
const getSingleProduct = asyncHandler(async (req, res) => {
    try {
        const {id}=req.params;
        const product=await Product.findById(id);
        res.json(product)
        
    } catch (error) {
        throw new Error(error);
    }
});
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const allProduct=await Product.find();
        res.json(allProduct)
        
    } catch (error) {
        throw new Error(error);
    }
});
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const {id}=req.params;
        const updateProduct=await Product.findByIdAndUpdate(id,req.body,{
            new:true
        });
        res.json(updateProduct)
        
    } catch (error) {
        throw new Error(error);
    }
});
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const {id}=req.params
        const deleteProduct=await Product.findByIdAndDelete(id);
        res.json(deleteProduct)
        
    } catch (error) {
        throw new Error(error);
    }
});
module.exports={createProduct,getSingleProduct,getAllProduct,updateProduct,deleteProduct}