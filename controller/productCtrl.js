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
const productFiltering = asyncHandler(async (req, res) => {
    try {

        //filtering
        const queryObj={ ...req.query };
        let excludeFields=["sort","page","limit","fields"]
        excludeFields.forEach((element)=> delete queryObj[element]);
        let queryStr=JSON.stringify(queryObj);
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        let query= Product.find(JSON.parse(queryStr));
        //sorting
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(" ");
            query=query.sort(sortBy);
        }else{
            query=query.sort("-createdAt");
        }

        //limiting fields
        if(req.query.fields){
            const fields=req.query.fields.split(',').join(" ");
            query=query.select(fields);
        }else{
            query=query.select("-__v");
        }

        //pagination
        const page=req.query.page;
        const limit=req.query.limit;
        const skip=(page-1)*limit;

        console.log(skip);
        query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount=await Product.countDocuments();
            if(skip >= productCount) throw new Error("there is no pages exist");
        }
        
        const filteredProduct=await query
        res.json(filteredProduct)
    } catch (error) {
        throw new Error(error);
    }
});
module.exports={createProduct,getSingleProduct,getAllProduct,updateProduct,deleteProduct,productFiltering}