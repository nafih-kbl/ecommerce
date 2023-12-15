const multer=require('multer');
const sharp=require('sharp');
const path=require('path');
const fs=require('fs')


const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../images/img"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9);
        cb(null,file.fieldname+'-'+uniqueSuffix+'.jpeg');
       
    }
});

const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true);
    }else{
        cb({message:"unsupproted file"},false);
    }
}
const uploadPhoto=multer({
    
        storage:multerStorage,
        fileFilter:multerFilter,
        limits:{fileSize:300000}
});

const productImageResize=async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path).resize(300,300).toFormat("jpeg").jpeg({quality:90}).toFile(`images/img/products/${file.filename}`);
            console.log(file.path);
            fs.unlinkSync(`images/img/products/${file.filename}`)        })
    )
    next();
}

module.exports={uploadPhoto,productImageResize}