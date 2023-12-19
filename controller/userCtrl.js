const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const {sendEmail}=require("./emailCtrl")
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const { json } = require('body-parser');
const Cart=require('../models/cartModel');
const Product = require('../models/productModel');
const Discount=require('../models/coupenModel');




const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email })
    if (!findUser) {
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        throw new Error('User Already Exist');
    }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
    try {
        const email = req.body.email;
        const findUser = await User.findOne({ email })
        if (findUser && (await findUser.isPasswordMatched(req.body.password))) {
            const refreshToken=await generateRefreshToken(findUser?._id);
            const updateUser=await User.findByIdAndUpdate(findUser?._id,
                {
                    refreshToken:refreshToken
                },
                {
                    new:true
                });
                res.cookie("refreshToken",refreshToken,{
                    httpOnly:true,
                    maxAge:72*60*60*1000
                })
            res.json({
                _id: findUser?._id,
                firstname: findUser?.   firstname,
                lasttname: findUser?.lasttname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id)

            })
        } else {
            throw new Error('Invalid Credentials')
        }

    } catch (error) {
        throw new Error(error)
    }
});

const loginAdmin = asyncHandler(async (req, res) => {
    try {
        const email = req.body.email;
        const findUser = await User.findOne({ email });
        if(findUser.role !== 'admin')
        {
            throw new Error('Your Not Admin')
        }else{
            if (findUser && (await findUser.isPasswordMatched(req.body.password))) {
                const refreshToken=await generateRefreshToken(findUser?._id);
                await User.findByIdAndUpdate(findUser?._id,
                    {
                        refreshToken:refreshToken
                    },
                    {
                        new:true
                    });
                    res.cookie("refreshToken",refreshToken,{
                        httpOnly:true,
                        maxAge:72*60*60*1000
                    })
                res.json({
                    _id: findUser?._id,
                    firstname: findUser?.   firstname,
                    lasttname: findUser?.lasttname,
                    email: findUser?.email,
                    mobile: findUser?.mobile,
                    token: generateToken(findUser?._id)
    
                })
            } else {
                throw new Error('Invalid Credentials')
            }
        }

    } catch (error) {
        throw new Error(error)
    }
});

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const allUser = await User.find()
        res.json(allUser)
    } catch (error) {
        throw new Error(error)
    }
});
const getSingleUSer = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongodbId(id)
        const user = await User.findById(id)
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteAuser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongodbId(id)
        const deletedUSer = await User.findByIdAndDelete(id)
        res.json(deletedUSer)
    } catch (error) {
        throw new Error(error)
    }
});
const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies")

    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken});
    if(!user) throw new Error("No Refresh Token Present In Db Or Not Matched");
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !== decoded.id)
        {
            throw new Error("There Is Somthing Went Wrong"+err);
        }
        const accessToken=generateToken(user?._id);
        res.json({accessToken})
    })


});
const logoutUser=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken});
    if(!user)
    {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        })
        res.sendStatus(204);
    }
    const logout= await User.findOneAndUpdate({refreshToken},{
        refreshToken:""
    });
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    res.sendStatus(204);

});
const updtateUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id,
            {
                firstname: req.body?.firstname,
                lasttname: req.body?.lasttname,
                email:     req.body?.email,
                mobile:    req.body?.mobile,
            },{
                new:true
            })
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
});
const blockUser=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        validateMongodbId(id)
        const blockUser= await User.findByIdAndUpdate(id,
            {
                isBlocked:true
            },
            {
                new:true
            })
            res.json(blockUser)
    } catch (error) {
        throw new Error(error)
    }

});
const unblockUser=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        validateMongodbId(id)
        const unblockUser= await User.findByIdAndUpdate(id,
            {
                isBlocked:false
            },
            {
                new:true
            })
            res.json(unblockUser)
    } catch (error) {
        throw new Error(error)
    }

});
const updatePassword=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    console.log(_id);
    const {password}=req.body;
    validateMongodbId(_id);
    const user=await User.findById(_id);
    if(password){
        user.password=password;
        const updatedPassword= await user.save();
        res.json(updatedPassword)
    }
    else{
        res.json(user)
    }
});
const forgetPasswordToken=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const findUser=await User.findOne({email});
    if(!findUser) throw new Error("User Not Found In These Email");
    try {
            const token=await findUser.createPasswordResetToken();
            console.log(token)
            await findUser.save();
            const resetUrl=`hi this is your reset url, this valid till 10 minutes <a href='http://localhost:3000/api/user/resetPassword/${token}'>click here</a>`;
            const data={
                to:"nafihkbl123@gmail.com",
                subject:"forget password link",
                text:"please confirm its you",
                html:resetUrl                        
            }
            sendEmail(data)
            res.json(token)
    } catch (error) {
        throw new Error(error)
    }
});
const resetPassword=asyncHandler(async (req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const hashedToken=crypto.createHash('sha256').update(token).digest("hex");
    const user=await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpire:{$gt:Date.now()}
    });
    if(!user) throw new Error("the token has been expired");
    user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetExpire=undefined;
    await user.save();
    res.json(user);
});
const addToCart=asyncHandler(async(req,res)=>{
    // res.send("this is from cart")
    const {_id}=req.user;
    const {userCart}=req.body;
    const products=[];
    let cartTotal=0;
    try {
       const cartExist=await Cart.findOne({orderby:_id});
        if(cartExist){

        }else{
            for (let i = 0; i < userCart.length; i++) {
                const cartProducts={};
                cartProducts.product=userCart[i]._id;
                cartProducts.count=userCart[i].count;
                cartProducts.color=userCart[i].color;
                const productPrice=await Product.findOne({_id:userCart[i]._id}).select('price').exec();
                cartProducts.price=productPrice.price;
                products.push(cartProducts);
            }
            for(let i=0; i<products.length; i++) {
                cartTotal += products[i].count * products[i].price;
            };
            const newCart= new Cart({products,cartTotal,orderby:_id});
            await newCart.save();
            res.json(newCart);
        }
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getSingleUSer,
    deleteAuser,
    updtateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgetPasswordToken,
    resetPassword,
    loginAdmin,
    addToCart
}

