const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        maxlength:50,
    },
    email:{
        type:String,
        trim:true,
        unique:1,
    },
    password:{
        type:String,
        minlength:5,
    },
    lastname:{
        type:String,
        maxlength:50,
    },
    role:{
        type:Number,
        default:0,
    },
    token:{
        type:String,
    },
    tokenExp:{
        type:Number,
    },
    date:{
        type:Date,
        default:Date.now()
    }
})



module.exports=mongoose.model('User',userSchema)