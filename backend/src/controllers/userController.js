const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const fields = ["phone", "date_of_birth", "gender", "qualification", "branch", "college", "graduation_year", "skills", "projects", "experience", "certifications", "career_interests", "career_objective"];
const clean = value => { if (value === undefined || value === null) return null; const v=String(value).trim(); return v === "" ? null : v; };
async function ensureProfile(userId) {
  await pool.execute("INSERT IGNORE INTO user_profiles (user_id) VALUES (?)", [userId]);
}
async function getData(userId) {
  await ensureProfile(userId);
  const [[users]] = await pool.execute("SELECT id, username, email, role, created_at FROM users WHERE id = ?", [userId]);
  const [[profile]] = await pool.execute("SELECT * FROM user_profiles WHERE user_id = ?", [userId]);
  if (!users) return null;
  return { user: users, profile: {
    ...Object.fromEntries(fields.map(f => [f, profile[f]])),
    profile_picture_url: profile.profile_picture_path ? "/user/profile/picture/file" : null,
    has_resume: !!(profile.resume_path || profile.resume_data),
    resume_original_name: profile.resume_original_name,
    resume_uploaded_at: profile.resume_uploaded_at,
    resume_data: profile.resume_data ? JSON.parse(profile.resume_data) : null
  }};
}
exports.getProfile = async (req, res) => {
  try { const data = await getData(req.user.id); if (!data) return res.status(404).json({message:"User not found"}); res.json(data); }
  catch (e) { console.error("getProfile:", e); res.status(500).json({message:"Could not load profile"}); }
};
exports.updateProfile = async (req, res) => {
  try {
    const username = clean(req.body.fullName);
    if (!username || username.length > 100) return res.status(400).json({message:"Full name is required (maximum 100 characters)"});
    const year = req.body.graduationYear ? Number(req.body.graduationYear) : null;
    if (year !== null && (!Number.isInteger(year) || year < 1950 || year > 2100)) return res.status(400).json({message:"Graduation year is invalid"});
    const phone=clean(req.body.phone); if(phone && !/^[+0-9().\-\s]{7,25}$/.test(phone)) return res.status(400).json({message:"Phone number format is invalid"});
    const dob=clean(req.body.dateOfBirth); if(dob && (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || dob > new Date().toISOString().slice(0,10))) return res.status(400).json({message:"Date of birth is invalid"});
    const map = {phone:"phone",dateOfBirth:"date_of_birth",gender:"gender",qualification:"qualification",branch:"branch",college:"college",graduationYear:"graduation_year",skills:"skills",projects:"projects",experience:"experience",certifications:"certifications",careerInterests:"career_interests",careerObjective:"career_objective"};
    const vals = fields.map(col => { const key = Object.keys(map).find(k => map[k] === col); return col === "graduation_year" ? year : clean(req.body[key]); });
    await ensureProfile(req.user.id);
    await pool.execute("UPDATE users SET username = ? WHERE id = ?", [username, req.user.id]);
    await pool.execute(`UPDATE user_profiles SET ${fields.map(f=>`${f} = ?`).join(", ")} WHERE user_id = ?`, [...vals, req.user.id]);
    res.json({message:"Profile updated", ...(await getData(req.user.id))});
  } catch (e) { console.error("updateProfile:", e); res.status(500).json({message:"Could not save profile"}); }
};
exports.saveResumeData = async (req,res) => {
  try { const allowed=["objective","education","skills","projects","experience","certifications"]; const data={}; for(const k of allowed){data[k]=clean(req.body[k])||"";if(data[k].length>8000)return res.status(400).json({message:`${k} is too long`});} await ensureProfile(req.user.id); await pool.execute("UPDATE user_profiles SET resume_data = ? WHERE user_id = ?",[JSON.stringify(data),req.user.id]); const result=await getData(req.user.id);res.json({message:"Resume details saved",user:result.user,profile:result.profile}); }
  catch(e){console.error("saveResumeData:",e);res.status(500).json({message:"Could not save resume details"});}
};
exports.uploadFile = async (req,res) => {
  try {
    if(!req.file)return res.status(400).json({message:"Choose a file to upload"});
    const isPicture=req.uploadKind==="picture"; const column=isPicture?"profile_picture_path":"resume_path";
    // Verify file signatures as well as the client-provided MIME type/extension.
    const fd=fs.openSync(req.file.path,"r"); const head=Buffer.alloc(12); const bytes=fs.readSync(fd,head,0,12,0); fs.closeSync(fd);
    const sig=head.subarray(0,bytes); const ext=path.extname(req.file.originalname).toLowerCase();
    const valid=isPicture ? ((ext===".jpg"||ext===".jpeg")&&sig[0]===0xff&&sig[1]===0xd8 || ext===".png"&&sig.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || ext===".webp"&&sig.toString("ascii",0,4)==="RIFF"&&sig.toString("ascii",8,12)==="WEBP") : (ext===".pdf"&&sig.toString("ascii",0,4)==="%PDF" || ext===".doc"&&sig.subarray(0,8).equals(Buffer.from([0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1])) || ext===".docx"&&sig[0]===0x50&&sig[1]===0x4b);
    if(!valid){fs.unlink(req.file.path,()=>{});return res.status(400).json({message:"The uploaded file content does not match its file type"});}
    await ensureProfile(req.user.id);
    const [[old]]=await pool.execute(`SELECT ${column} AS old_path FROM user_profiles WHERE user_id = ?`,[req.user.id]);
    await pool.execute(isPicture?"UPDATE user_profiles SET profile_picture_path = ? WHERE user_id = ?":"UPDATE user_profiles SET resume_path = ?, resume_original_name = ?, resume_uploaded_at = CURRENT_TIMESTAMP, resume_data = NULL WHERE user_id = ?", isPicture?[req.file.filename,req.user.id]:[req.file.filename,req.file.originalname,req.user.id]);
    if(old?.old_path){const oldPath=path.join(__dirname,"../../uploads",String(req.user.id),path.basename(old.old_path));fs.promises.unlink(oldPath).catch(()=>{});}
    const data=await getData(req.user.id);res.json({message:"File uploaded",...data});
  } catch(e){console.error("uploadFile:",e);res.status(500).json({message:"Could not save uploaded file"});}
};
exports.removePicture = async (req,res)=>{try{await ensureProfile(req.user.id);const [[p]]=await pool.execute("SELECT profile_picture_path FROM user_profiles WHERE user_id = ?",[req.user.id]);await pool.execute("UPDATE user_profiles SET profile_picture_path = NULL WHERE user_id = ?",[req.user.id]);if(p?.profile_picture_path)fs.promises.unlink(path.join(__dirname,"../../uploads",String(req.user.id),path.basename(p.profile_picture_path))).catch(()=>{});res.json({message:"Picture removed",...(await getData(req.user.id))});}catch(e){console.error(e);res.status(500).json({message:"Could not remove picture"});}};
exports.serveFile = async (req,res)=>{try{const col=req.params.kind==="picture"?"profile_picture_path":req.params.kind==="resume"?"resume_path":null;if(!col)return res.status(404).end();const [[p]]=await pool.execute(`SELECT ${col} AS file_path, ${req.params.kind==="resume"?"resume_original_name":"NULL AS resume_original_name"} FROM user_profiles WHERE user_id = ?`,[req.user.id]);if(!p?.file_path)return res.status(404).json({message:"File not found"});const file=path.join(__dirname,"../../uploads",String(req.user.id),path.basename(p.file_path));if(!fs.existsSync(file))return res.status(404).json({message:"Stored file not found"});if(req.params.kind==="picture")res.setHeader("Content-Type",p.file_path.endsWith(".png")?"image/png":p.file_path.endsWith(".webp")?"image/webp":"image/jpeg");else{const ext=path.extname(p.resume_original_name||"").toLowerCase();const mime=ext===".pdf"?"application/pdf":ext===".doc"?"application/msword":"application/vnd.openxmlformats-officedocument.wordprocessingml.document";res.setHeader("Content-Type",mime);const disposition=req.query.view==="1"&&ext===".pdf"?"inline":"attachment";res.setHeader("Content-Disposition",`${disposition}; filename="${path.basename(p.resume_original_name||"resume")}"`);}res.sendFile(file);}catch(e){console.error("serveFile:",e);res.status(500).json({message:"Could not retrieve file"});}};
