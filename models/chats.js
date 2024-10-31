const Sequelize=require("sequelize");
const sequelize=require('../util/database');
const Chats=sequelize.define("chats",{
    id :{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    name : {
        type:Sequelize.STRING,
        allowNull:false,
    },
    text:{
        type:Sequelize.STRING,
        allowNull:false,
    }
},{ freezeTableName: true,})
module.exports=Chats;