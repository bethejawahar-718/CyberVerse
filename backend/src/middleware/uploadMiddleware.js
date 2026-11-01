const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const storage = multer.diskStorage({
  destination: (req,file,cb) => { const dir=path.join(__dirname,"../../uploads",String(req.user.id)); fs.mkdirSync(dir,{recursive:true}); cb(null,dir); },
  filename: (req,file,cb) => { const ext=path.extname(file.originalname).toLowerCase(); cb(null,crypto.randomBytes(18).toString("hex")+ext); }
});
const upload = multer({storage,limits:{fileSize:5*1024*1024,files:1},fileFilter:(req,file,cb)=>{
  const ext=path.extname(file.originalname).toLowerCase();
  const picture=req.uploadKind==="picture";
  const ok=picture ? ([".jpg",".jpeg",".png",".webp"].includes(ext)&&["image/jpeg","image/png","image/webp"].includes(file.mimetype)) : ([".pdf",".doc",".docx"].includes(ext)&&["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/octet-stream"].includes(file.mimetype));
  if(!ok)return cb(new Error(picture?"Only JPG, PNG or WEBP images are allowed":"Only PDF, DOC or DOCX resumes are allowed")); cb(null,true);
}});
module.exports=(kind)=>(req,res,next)=>{req.uploadKind=kind;upload.single("file")(req,res,err=>{if(err)return res.status(400).json({message:err.message});next();});};
