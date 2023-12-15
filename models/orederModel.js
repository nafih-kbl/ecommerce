const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        count:Number,
        color:String
    }],
    payamentIntent:{},
    orderStatus:{
        type:String,
        default:"not processed",
        enum:[
            "not processed",
            "processing",
            "dispatched",
            "canceled",
            "delivered"
        ]
    },
    orderby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
    }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Oreder', orderSchema);