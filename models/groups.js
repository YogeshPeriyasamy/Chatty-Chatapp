const Sequelize = require("sequelize");
const sequelize = require('../util/database');

async function getGroupModel(groupName) {
    const modelName = groupName.toLowerCase();
    
    // Check if the model is already defined in sequelize.models
    if (!sequelize.models[modelName]) {
        // Define the model only if it doesn't already exist
        sequelize.models[modelName] = sequelize.define(groupName, {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            mailid: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            text: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userid: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, { freezeTableName: true, timestamps: false });

        // Sync only when defining a new model
        await sequelize.models[modelName].sync();
        console.log(" its synced");
    }
    
    return sequelize.models[modelName];
}

module.exports = getGroupModel;
