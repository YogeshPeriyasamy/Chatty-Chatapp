const express=require("express");
const router=express.Router();

//create a routr path
const user_path=require('../controller/origincontroller');
const chat_path=require('../controller/chats');
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

module.exports=router;