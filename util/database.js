const Sequelize=require("sequelize");
const sequelize=new Sequelize('chattydb','chattyadmin1','YogeshRDS1209',{
    dialect:"mysql",
    host:'database-1.c3g844os4jeu.eu-north-1.rds.amazonaws.com',
})
module.exports=sequelize;