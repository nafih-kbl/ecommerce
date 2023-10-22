const mongoose = require('mongoose')


const dbConnect= async()=>{
    try{
    
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('database connected succesfully');

    }catch (error)
    {
        console.log('error'+error);
    }
}   

module.exports=dbConnect;