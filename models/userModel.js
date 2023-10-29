const mongoose = require('mongoose');
const bcrypt=require('bcrypt')

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
});

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSaltSync(10);
    this.password= bcrypt.hashSync(this.password, salt);
});

userSchema.methods.isPasswordMatched=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};


module.exports = mongoose.model('User', userSchema);