const path=require("path");
const userdb=require('../models/user');
const chatdb=require('../models/chats');
const { Op } = require('sequelize'); // Sequelize operators

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
            userId:req.session.userId,
        })
    res.json(user);
    }catch(err){
        console.log('adding chats error',err);
    }
}

//to fetch the  chats 
exports.fetchallchats=async(req,res)=>{
  try{
      const offset=Number(req.query.after);
      console.log(offset) 
      const user=await userdb.findByPk(req.session.userId);
      const chats=await chatdb.findAll({
        where:{
            id: {
                [Op.gt]: offset // Only messages with ID greater than 'after'
            }
// Greater Than: Op.gt
// Less Than: Op.lt
// Greater Than or Equal To: Op.gte
// Less Than or Equal To: Op.lte
        },
        order:[["id","ASC"]],
      });
      console.log("from backend",chats);
      res.json({chats:chats,username:user.name,});
  }catch(err){
    console.log("fetching from db in backend",err)
  }
}