const express=require("express");
const router=express.Router();

//create a routr path
const user_path=require('../controller/origincontroller');
const chat_path=require('../controller/chats');
const group_path=require('../controller/groups');
const creategroup_path=require('../models/groups');
//logging in
router.get("/login",user_path.login);
//newuser signup
router.get("/signuppage",user_path.signuppage);
//adding user data to sql
router.post("/signup",user_path.signup);
//checking login credentials
router.post("/logindetails",user_path.addlogin);
//to open the chatbox
router.get("/chatbox",chat_path.chatbox);
//to add chats in a db
router.post("/addchats",chat_path.addchats);
//to fetch all the chats
router.get("/fetchallchats",chat_path.fetchallchats);
//get users to add in group
router.get("/getusersforgroup",group_path.getallusers);
//to crete a group db
router.post("/creategroup",group_path.addMessage);
//to get the tables to dispaly
router.get("/gettables",user_path.gettables);
//to get the cahts from that groupdb
router.get("/fetchgroupchats",group_path.getgroupchats);
// to send message to the correct group
router.post("/addgroupchats",group_path.addgroupmessage);
module.exports=router;