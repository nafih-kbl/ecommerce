const blog=require("../models/blogModel");
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const createBlog=asyncHandler(async (req,res)=>{
    try {
        const newBlog=await blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});
const updateBlog=asyncHandler(async(req,res)=>{
    try {
        const id=req.params
        const blogUpdate=await blog.findByIdAndUpdate(id,req.body,{
            new:true
        });
        res.json(blogUpdate)
    } catch (error) {
        throw new Error(error);
    }
});
const showAllBlogs=asyncHandler(async(req,res)=>{
    try {
        const allBlogs=await blog.find();
        res.json(allBlogs);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteBlog=asyncHandler(async(req,res)=>{
    try {
        const id=req.params;
        const deletedBlog=await blog.findByIdAndDelete(id);
        res.json(deletedBlog)
    } catch (error) {
        throw new Error(error);
    }
});
const getBlog=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const numViews=await blog.findByIdAndUpdate(id,{
            $inc:{
                numViews:1
            }
        },{
            new:true
        });
        const singleBlog= await blog.findById(id).populate('likes');
        res.json(singleBlog)
    } catch (error) {
        throw new Error(error);
    }
});
const likeBlog=asyncHandler(async(req,res)=>{
    const {blogId}=req.body;
    const logInuserId=req?.user?._id;
    const getBlog=await blog.findById(blogId);
    console.log(blogId);
    const isLiked=getBlog?.isLiked;
    const alreadyDisLiked=await blog?.disLikes?.find(((userId)=>userId?.toStrig() === userId.toStrig()));
    if(alreadyDisLiked)
    {
        const getBlog = await blog.findByIdAndUpdate(blogId,{
            $pull:{
                disLikes:logInuserId
            },
            isDisLiked:false
        },{
            new:true
        });
        res.json(getBlog);
    }
    if(isLiked)
    {
        const getBlog = await blog.findByIdAndUpdate(blogId,{
            $pull:{
                likes:logInuserId
            },
            isLiked:false
        },{
            new:true
        });
        res.json(getBlog);
    }else{
        const getBlog=await blog.findByIdAndUpdate(blogId,{
            $push:{
                likes:logInuserId
            },
            isLiked:true
        },{
            new:true
        });
        res.json(getBlog);
    }
});

const disLikeBlog=asyncHandler(async(req,res)=>{
    const {blogId}=req.body;
    const logInuserId=req?.user?._id;
    const getBlog=await blog.findById(blogId);
    console.log(blogId);
    const isDisLiked=getBlog?.isDisLiked;
    const alreadyLiked=await blog?.likes?.find(((userId)=>userId?.toStrig() === userId.toStrig()));
    if(alreadyLiked)
    {
        const getBlog = await blog.findByIdAndUpdate(blogId,{
            $push:{
                likes:logInuserId
            },
            isLiked:true
        },{
            new:true
        });
        res.json(getBlog);
    }
    if(isDisLiked)
    {
        const getBlog = await blog.findByIdAndUpdate(blogId,{
            $pull:{
                disLikes:logInuserId
            },
            isDisLiked:false
        },{
            new:true
        });
        res.json(getBlog);
    }else{
        const getBlog=await blog.findByIdAndUpdate(blogId,{
            $push:{
                disLikes:logInuserId
            },
            isDisLiked:true
        },{
            new:true
        });
        res.json(getBlog);
    }
});
module.exports={
    createBlog,
    updateBlog,
    showAllBlogs,
    deleteBlog,
    getBlog,
    likeBlog,
    disLikeBlog
}


