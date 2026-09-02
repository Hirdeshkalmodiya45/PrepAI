const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware=require("../middleware/auth");
const agentManager = require("../agents/agentManager");
const Resume=require("../models/Resume");
const upload=require("../middleware/uploadResume");
const {loadResume}=require("../services/pdfLoader");
const {splitDocuments }=require("../services/textSplitter")
const {createVectorStore}=require("../services/vectorStore");
const { logActivity } = require("../services/activityService");


router.post("/chat", authMiddleware, async (req, res) => {

    try {

        const { coach,message } = req.body;

      const reply = await agentManager({
      coach,
      userId: req.user.userId,
      message,
    });

        res.json({
            success: true,
            reply,
        });

    
    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });

    }

});


router.post("/uploadresume",authMiddleware,  upload.single("resume"),async(req,res)=>{
  try{  const resume=await Resume.create({
                    user:req.user.userId,

            filename:req.file.filename,

            originalName:req.file.originalname,

            path:req.file.path,

            size:req.file.size,

            mimeType:req.file.mimetype,

    });
    const docs = await loadResume(req.file.path);
const chunks = await splitDocuments(docs);
await createVectorStore(chunks, req.user.userId);
await logActivity(
  req.user.userId,
  "RESUME_UPLOAD",
  "Resume Uploaded",
  "Uploaded a new resume"
);

await agentManager({
    coach: "resume",
    userId: req.user.userId,
    message: "RESUME_ANALYSIS",
});




      res.status(201).json({

            success:true,

            resume,

        });
    }
      catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Upload Failed"

        });

    }
})






module.exports=router;