const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const crypto=require("crypto");


var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    lasttname:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'user',
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    },
    passwordChangedAt:{type:Date},
    passwordResetToken:{type:String},
    passwordResetExpire:{type:Date},
    wishlists:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]

},{
    timestamps:true
});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password= bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.methods.isPasswordMatched=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};
userSchema.methods.createPasswordResetToken= async function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest("hex");
    this.passwordResetExpire=Date.now()+30*60*1000; //10 minutes
    return  resetToken;
};

module.exports = mongoose.model('User', userSchema);