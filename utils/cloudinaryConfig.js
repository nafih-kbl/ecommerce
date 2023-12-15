const cloudinary=require('cloudinary');
const path=require('path');

         
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API, 
  api_secret: process.env.CLOUD_SECRET
});

const cloudinaryUploadImg=async(fileToUpload)=>{
    return new Promise(async(resolve)=>{
        cloudinary.uploader.upload(fileToUpload,
  (result)=>{
    // console.log(result);
    resolve({
        url:result.secure_url
    },{
        resource_type:"auto"
    })
  });
    })
}

module.exports=cloudinaryUploadImg;