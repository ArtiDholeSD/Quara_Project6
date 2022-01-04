const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    lname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,  //valid & unique
        trim:true
        
    },
    phone:{
        type:String, //not Manadatory // unique // indian mobile number
        unique:true,
        trim:true,
    },
    password:{   // encrypted password
        type:String,  
        required:true,
        trim:true,
        //minlength:8,
        //maxlength:15
    }
}, {timestamps: true} )



module.exports=mongoose.model("QuaraUser",userSchema)  


