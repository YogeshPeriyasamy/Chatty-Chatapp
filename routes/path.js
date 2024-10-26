const express=require("express");
const router=express.Router();

//create a routr path
const user_path=require('../controller/origincontroller');

//logging in
router.get("/login",user_path.login);
//newuser signup
router.get("/signuppage",user_path.signuppage);
//adding user data to sql
router.post("/signup",user_path.signup);
//checking login credentials
router.post("/logindetails",user_path.addlogin);

module.exports=router;