// models/Resume.js

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    filename:String,

    originalName:String,

    path:String,

    size:Number,

    mimeType:String,
},
{
    timestamps:true,
});

module.exports=mongoose.model("Resume",resumeSchema);