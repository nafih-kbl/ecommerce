const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validateMongodbId');
const slugify=require('slugify');
const User = require('../models/userModel');
const userModel = require('../models/userModel');
const cloudinaryUploadImg=require('../utils/cloudinaryConfig');
const fs=require('fs');


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

const addToWishlist=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    const {proId}=req.body;
    try {
        const user=await User.findById(_id);
        const alreadyInWishlist= user.wishlists.find((id)=>id.toString() === proId);
    if(alreadyInWishlist)
    {
        const user=await User.findByIdAndUpdate(_id,{
            $pull:{wishlists:proId}
        },{new:true});
        res.json(user);
    }else{
        const user=await User.findByIdAndUpdate(_id.toString(),{
            $push:{wishlists:proId}
        },{new:true});
        res.json(user);
    }
    } catch (error) {
        throw new Error(error)
    }
});
const ratingProduct=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    const {star,proId}=req.body;
    const product=await Product.findById(proId);
    const alreadyRated= product.rating.find((userID)=>userID.postedby.toString() === _id.toString());
    if(alreadyRated){
        const updateRating=await Product.updateOne({
            rating:{$elemMatch:alreadyRated}
        },
        {
            $set:{
                "rating.$.star":star
            }
        },{new:true});
        // res.json(updateRating)
    }else{
        const rateProduct=await Product.findByIdAndUpdate(proId,{
            $push:{
                rating:{
                    star:star,
                    postedby:_id
                }
            }   
        },{new:true});
        // res.json(rateProduct);
    }

    const Ratings=await Product.findById(proId);
    const totalRating=Ratings.rating.length;
    const starSum=Ratings.rating.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0);
    const actualRating=Math.round(starSum/totalRating);
    const finalProduct=await Product.findByIdAndUpdate(proId,{
        totalRating:actualRating
    },{new:true});
    res.json(finalProduct)
});
const uploadImage=asyncHandler(async(req,res)=>{
    console.log(req.files);
    const {id}=req.params;
    validateMongodbId(id);
    try {
        const uploadImg=(path)=>cloudinaryUploadImg(path,"images");

        const files=req.files;
        const urls=[];
        for(const file of files){
                const{path,destination,filename}=file
                const newPath=await uploadImg(path);
                urls.push(newPath);
                console.log(path);
                 fs.unlink(destination+filename, (err) => {
                    if (err) throw err;
                    // console.log('successfully deleted file');
                  });
        }
        const findProduct=await Product.findByIdAndUpdate(id,{
            images:urls.map((file)=> {return file})
        },{new:true});

        res.json(findProduct);

        
    } catch (error) {
        throw new Error(error)
    }
})
module.exports={
    createProduct,
    getSingleProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    productFiltering,
    addToWishlist,
    ratingProduct,
    uploadImage
}