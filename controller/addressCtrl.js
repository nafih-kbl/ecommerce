const Address=require('../models/addressModel');
const {validateMongodbId}=require('../utils/validateMongodbId');
const asyncHandler=require('express-async-handler');
const User = require('../models/userModel');


const createAddresses=asyncHandler(async(req,res)=>{
    try {
        const {_id}=req.user;
        req.body.userId=_id;
        const newAddress=await Address.create(req.body);
        await User.findByIdAndUpdate(_id,{
            $push:{userAddresses:newAddress._id}
        },{
            new:true
        })
        res.json(newAddress);
        
    } catch (error) {
        throw new Error(error);
    }
});

const updateAddress=asyncHandler(async(req,res)=>{
    try {
        const {addressId}=req.params;
        validateMongodbId(addressId);
        const {_id}=req.user;
        req.body.userId=_id;
       const updatedAddress= await Address.findByIdAndUpdate(addressId,req.body,{new:true});
        res.json(updatedAddress);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports={
    createAddresses,
    updateAddress
}