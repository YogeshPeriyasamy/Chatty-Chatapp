const express=require("express");
const cors=require('cors');
const session=require("express-session")
const app=express();

//middlewares
app.use(session({
    secret:"loginkey",
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        httpOnly:true,
        sameSite:"lax",
    }
}))
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({
    origin:"*",
    // method:["GET","POST"], which method should be allowed from other origin
    credentails:true,
}));


const sequelize=require('./util/database');

//router 
const router=require('./routes/path');
app.use("/chatty",router);


sequelize.sync()
.then(()=>{
    app.listen(3000,()=>{
        console.log("database synced and port is running");
    })
})
.catch((err)=>{
    console.log("database not synced",err);
})

