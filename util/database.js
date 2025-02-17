const Sequelize=require("sequelize");
const sequelize=new Sequelize(process.env.chattydb,process.env.username,process.env.password,{
    dialect:"mysql",
    host:process.env.hostname,
})
module.exports=sequelize;