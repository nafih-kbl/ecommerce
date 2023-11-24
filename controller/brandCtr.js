const brand=require("../models/brandModel");
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const createBrand=asyncHandler(async(req,res)=>{
    try {
       const newBrand= await brand.create(req.body);
       res.json(newBrand)
        
    } catch (error) {
        throw new Error(error)
    }
});

const updateBrand=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const updatedBrand=await brand.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
    }
});

const getBrand=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
       const Brand=await brand.findById(id);
        res.json(Brand)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllBrands=asyncHandler(async(req,res)=>{
    try {
        const akkBrands=await brand.find();
        res.json(akkBrands)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteBrand=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const deletedBrand=await brand.findByIdAndDelete(id);
        res.json(deletedBrand)
    } catch (error) {
        throw new Error(error)
    }
});


module.exports={
    createBrand,
    updateBrand,
    getBrand,
    getAllBrands,
    deleteBrand
}