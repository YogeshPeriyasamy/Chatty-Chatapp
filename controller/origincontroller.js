const bcrypt=require("bcrypt");
const path=require("path");
const userdb=require('../models/user');
const sequelize = require("../util/database");
const Sequelize=require("sequelize");
// tologin
exports.login=(req,res)=>{
    res.sendFile(path.join(__dirname,('../view/loginpage.html')));
}

// to open signup page
exports.signuppage=(req,res)=>{
    res.sendFile(path.join(__dirname,('../view/signuppage.html')));
}

//to add userdetails into sql
exports.signup=async(req,res)=>{
    const{name,mail,phnumber,signuppassword}=req.body;
    console.log(name,mail,phnumber,signuppassword);
    try{
        const encryptedpassword=await bcrypt.hash(signuppassword,10);
        console.log("encryted password",encryptedpassword)
        const user=await userdb.findOne({where:{mail:mail}});
        if(!user){
            await userdb.create({
                name:name,
                mail:mail,
                phnumber:phnumber,
                password:encryptedpassword, 
            })
            res.json({message:"User has been registered",redirect:true,url:'http://localhost:3000/chatty/login'})
        }
        else{
            res.json({message:"Already a user",redirect:true,url:'http://localhost:3000/chatty/login'})
        }

    }catch(err){
        console.log("while signup",err);
    }
}



//to check login details
exports.addlogin=async(req,res)=>{
    const{name,mail,loginpassword}=req.body;
    try{
    const user=await userdb.findOne({where:{mail:mail}})
    if(!user){
        return res.json({message:"not a user"})
    }
    bcrypt.compare(loginpassword,user.password,async(err,result)=>{
        if(result){
            req.session.userId=user.id;
            console.log("session id on loginage", req.session.userId)
            await req.session.save((err)=>{
                if(err){
                console.log("req session mot registered");
                }
            })
            res.json({message:"user logged in",redirect:true,url:'http://localhost:3000/chatty/chatbox'})
        }
        else{
            res.json({message:"password not matched"});
        }
    })
}catch(err){
    console.log("while loging in",err);
}

}

// to get the tablesnames
exports.gettables=async(req,res)=>{
try{
   const queryinterface=sequelize.getQueryInterface();
   const tables=await queryinterface.showAllTables()
   console.log("tables fetches",tables);
   const filteredTables = tables.filter(table => table !== "user" && table !== "chats");
   res.json(filteredTables);
}catch(err){
    console.log("while getting tablesnames from be",err)
}
}