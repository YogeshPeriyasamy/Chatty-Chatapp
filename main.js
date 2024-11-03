const express=require("express");
const cors=require('cors');
const session=require("express-session")
const path=require("path");
const helmet=require('helmet');
const compression=require('compression');
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
//in network tab requst there will be access allow origin control with it there is options as well its send by browser for special request like post 
//put delete metods it sends option first like asking permission before the actual request its called preflight requeset
app.use(cors({
    origin:"*",
    // method:["GET","POST"], which method should be allowed from other origin//
    credentails:true,
}));

//to provide css for the boooking page set the route
app.use(express.static(path.join(__dirname,'css')));

//middelware to add security headers
//app.use(helmet({ contentSecurityPolicy: false }));

//middware to compress our file
app.use(compression());
//middle are to config .env
require('dotenv').config({path:('./util/.env')});
//router 
const router=require('./routes/path');
app.use("/chatty",router);


//database
const sequelize=require('./util/database');
const userdb=require('./models/user');
const chatdb=require('./models/chats');

//to establish relation between tables
userdb.hasMany(chatdb, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',  // Delete all associated chats if the user is deleted
});

chatdb.belongsTo(userdb, {
    foreignKey: {
        name: 'userId',
        allowNull: false,  // Ensure userId cannot be null
    },
});



// Async IIFE to handle await
(async () => {
    try {
        await sequelize.sync();
        app.listen(3000, () => {
            console.log("Database synced and server is running on port 3000");
        });
    } catch (err) {
        console.error("Database not synced", err);
    }
})();
