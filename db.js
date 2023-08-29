//database

const { Sequelize, DataTypes } = require('sequelize');
/**
 * @param {sequelize}  
 */
const { host, password, username, db, port } = require('./config.json')
const sequelize = new Sequelize(db, username, password, {
    host: host,
    dialect: 'mysql',
    port: port,
    logging: false
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

const User = sequelize.define('User', {
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        foreignKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chatXp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    messageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    chatLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    vcXp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    vcLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    modelName: "User",
    tableName: 'user',
    timestamps: true,
});

const Count = sequelize.define("count", {
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        foreignKey: true
    },
    dailyMsg: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    weeklyMsg: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    dailyVc: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    weeklyVc: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});
sequelize.sync({ alter: true })
    .then(() => console.log('tables, set'))
    .catch(err => console.log(err));

User.hasOne(Count, { foreignKey: 'uid' });
Count.belongsTo(User, { foreignKey: 'uid' });
module.exports = {
    User, Count
}