const multer= require("multer")
const path=require("path");
const storage=multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"uploads/resumes");
    },
    filename:(req,file,cd)=>{
        const uniqueName=  Date.now()+"-"+file.originalname;

        cd(null,uniqueName);
    }


});
const fileFilter=(req,file,cd)=>{

    if(file.mimetype==="application/pdf"){

        cd(null,true);

    }else{

        cd(new Error("Only PDF allowed"),false);

    }

}

module.exports=multer({

    storage,

    fileFilter,

});
