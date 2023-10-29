//not found

const notFound=(req,res,next)=>{
    const error=new Error(`NOT FOUND :${req.originalUrl}`);
    res.status(404);
    next(error)
};

//error
const errorhandler=(err,req,res,next)=>{
    const statusCode= res.statusCode == 200 ? 500 :res.statusCode;

    res.status(statusCode)

    res.json({
        message:err?.message,
        stack:err?.stack
    })

}


module.exports={
    notFound,
    errorhandler
}