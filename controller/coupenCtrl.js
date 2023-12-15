const Discount=require('../models/coupenModel');
const asyncHandler = require('express-async-handler');


const createCoupen=asyncHandler(async(req,res)=>{
    try {
        console.log("reached");
       const newCoupen= await Discount.create(req.body);
       res.json(newCoupen)
        
    } catch (errCoupen){
        throw new Error(error)
    }
});

const updateCoupen=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const updatedCoupen=await Discount.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCoupen)
    } catch (error) {
        throw new Error(error)
    }
});

const getCoupen=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
       const coupen=await Discount.findById(id);
        res.json(coupen)
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCoupen=asyncHandler(async(req,res)=>{
    try {
        const allCoupens=await Discount.find();
        res.json(allCoupens)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteCoupen=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const deletedCoupen=await Discount.findByIdAndDelete(id);
        res.json(deletedCoupen)
    } catch (error) {
        throw new Error(error)
    }
});


module.exports={
    createCoupen,
    updateCoupen,
    getCoupen,
    getAllCoupen,
    deleteCoupen
}