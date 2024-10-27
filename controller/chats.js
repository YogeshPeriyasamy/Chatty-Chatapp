const path=require("path");
const userdb=require('../models/user');
const chatdb=require('../models/chats');

//to open the chatbox
exports.chatbox=(req,res)=>{
    console.log("on chat page",req.session.userId);
    res.sendFile(path.join(__dirname,('../view/chatpage.html')));
}

//backend to add chats
exports.addchats=async(req,res)=>{
    const {text}=req.body;
    console.log(text);
    try{
        const user=await userdb.findByPk(req.session.userId);
        
        await chatdb.create({
            name:user.name,
            text:text,
        })
    res.json(user);
    }catch(err){
        console.log('adding chats error',err);
    }
}

//to fetch the  chats 
exports.fetchallchats=async(req,res)=>{
  try{
      const user=await userdb.findByPk(req.session.userId);
      const chats=await chatdb.findAll();
      
      res.json({chats:chats,username:user.name,});
  }catch(err){
    console.log("fetching from db in backend",err)
  }
}