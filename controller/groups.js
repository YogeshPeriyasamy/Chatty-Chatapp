const path=require("path");
const userdb=require('../models/user');
const chatdb=require('../models/chats');
const getGroupModel = require('../models/groups');
//to get all the users
exports.getallusers=async(req,res)=>{
    try{
        const users=await userdb.findAll();
        console.log("users for group",users);
        res.json(users);
    }catch(err){
        console.log("while getting users for group",err);
    }
    
}

// to create a table and add the message

exports.addMessage = async (req, res) => {
    
    const { group_name, members } = req.body;

    try {
        // Retrieve the group model for the specified group_name
        const GroupModel = await getGroupModel(group_name);
        
        // Find the user information
        const user = await userdb.findByPk(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
 //in foreach async function wont work as expected
 for (const member of members){
    const admin=await userdb.findByPk(req.session.userId);
    const user=await userdb.findOne({where:{name:member}});
    await GroupModel.create({
    name:member,
    mailid:user.mail,
    text:admin.name===user.name?"you joined":`${member} joined`,
    userid:Number(user.id),
    })
 }
console.log("members are added in group");
res.json({message:"table created"});
    } catch (err) {
        console.error("Error adding message to group:", err);
        res.status(500).json({ message: "Error adding message" });
    }
};

//to get the group chats
exports.getgroupchats=async(req,res)=>{
    const tablename=req.query.groupname;
    try{
        console.log(tablename);
        const GroupModel = await getGroupModel(tablename);
        const user = await userdb.findByPk(req.session.userId);
        const chats=await GroupModel.findAll();
        console.log(chats);
        res.json({username:user.name,allchats:chats,})
    }catch(err){
        console.log("getting chats fro group from be",err);
    }
}

//to add group secified message
exports.addgroupmessage=async(req,res)=>{
    const tablename=req.query.current;
    const{text}=req.body;
   try{
    console.log("while adding message to backend",tablename);
    const GroupModel = await getGroupModel(tablename);
    const user = await userdb.findByPk(req.session.userId);
    await GroupModel.create({
        name:user.name,
        mailid:user.mail,
        text:text,
        userid:Number(user.id),
    })
   }catch(err){
    console.log("while adding group messages in be",err)
   }
}

