const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')


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
            res.json({
                _id: findUser?._id,
                firstname: findUser?._id,
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
        const user = await User.findById(id)
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
});
const deleteAuser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUSer = await User.findByIdAndDelete(id)
        res.json(deletedUSer)
    } catch (error) {
        throw new Error(error)
    }
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




module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getSingleUSer,
    deleteAuser,
    updtateUser
}

