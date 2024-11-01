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
    isadmin:admin.name===user.name?true:false,
    ismember:true, 
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
        const allGroups = await GroupModel.findAll({
            attributes: ['name'],
            group: ['name'], // Group by name to ensure uniqueness
            raw: true
          });
      // Map the results to get an array of unique names
          const uniqueNames = allGroups.map(group => group.name);
          console.log("names we got from be",uniqueNames);
        //console.log(chats);
        res.json({username:user.name,allchats:chats,names:uniqueNames})
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
    // to heck the user is admin
    const lastAdminStatus = await GroupModel.findOne({
        where: { userid: user.id },
        order: [['createdAt', 'DESC']], // or ['id', 'DESC'] if using an auto-incrementing ID
        attributes: ['isadmin','ismember']
    });
    
    if(lastAdminStatus.dataValues.ismember==true){
        await GroupModel.create({
            name:user.name,
            mailid:user.mail,
            text:text,
            userid:Number(user.id),
            isadmin:lastAdminStatus.isadmin==true?true:false,
            ismember:true
        })
    }
    else{
        console.log(`${user.name} is not in group anymore`);
    }
    
 
   }catch(err){
    console.log("while adding group messages in be",err)
   }
}

// to change member into admin
exports.addnewadmin=async(req,res)=>{
   const {name,tablename}=req.body;
   console.log("add admin button is clicked",name,tablename)
  try{
    const GroupModel = await getGroupModel(tablename);
    const user = await userdb.findByPk(req.session.userId);
    // to heck the user is admin
    const lastuserAdminStatus = await GroupModel.findOne({
        where: { userid: user.id },
        order: [['createdAt', 'DESC']], // or ['id', 'DESC'] if using an auto-incrementing ID
        attributes: ['isadmin']
    });
    if(lastuserAdminStatus.isadmin){
        //t o check whether the person to be added is already a admin
        const member=await userdb.findOne({where:{name:name}})
        //console.log("member found ",member.name);
        const lastAdminStatus = await GroupModel.findOne({
            where: { name: member.name },
            order: [['createdAt', 'DESC']], // or ['id', 'DESC'] if using an auto-incrementing ID
            attributes: ['isadmin']
        });
        console.log("lastAdminStatus",lastAdminStatus)
        if(lastAdminStatus && lastAdminStatus.dataValues.isadmin === false){
            await GroupModel.create({
                name:member.name,
                mailid:member.mail,
                text:"You are a admin now",
                userid:Number(user.id),
                isadmin:true,
                ismember:true,
            })
        }
        else{
            console.log("member is already a admin");
        }
    }
    else{
        console.log("user is not an admin");
    }

  }catch(err){
    console.log("while changing member to admin fromm be",err)
  }

}

// to remove member form froup
exports.removememberfromgroup=async(req,res)=>{
   const{name,tablename}=req.body;
   console.log("delete button is clicked",name,tablename)
   try{
    const GroupModel = await getGroupModel(tablename);
    const user = await userdb.findByPk(req.session.userId);
    // to heck the user is admin
    const lastuserAdminStatus = await GroupModel.findOne({
        where: { userid: user.id },
        order: [['createdAt', 'DESC']], // or ['id', 'DESC'] if using an auto-incrementing ID
        attributes: ['isadmin']
    });
    if(lastuserAdminStatus.isadmin==true){
        await GroupModel.create({
            name:name,
            mailid:"xxx",
            text:"You are removed from group now",
            userid:0,
            isadmin:false,
            ismember:false,
        })
    }
    else{
        console.log("user is not admin");
    }
   }catch(err){
    console.log("while removing user from group");
   }
}

// to check the names are admin or not to dispaly in left side
exports.isadmin=async(req,res)=>{
   const{name,tablename}=req.body;
   console.log("is admin status",name,tablename)
   try{
    const GroupModel = await getGroupModel(tablename);
    const AdminStatus = await GroupModel.findOne({
        where: { name: name },
        order: [['createdAt', 'DESC']], // or ['id', 'DESC'] if using an auto-incrementing ID
        attributes: ['isadmin']
    });  
    res.json(AdminStatus.isadmin);
   }catch(err){
    console.log("while checking the names are admin or not");
   }
}

