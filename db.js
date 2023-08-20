//database

const { Sequelize, DataTypes } = require('sequelize');

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
        unique: true

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    chatXp: {
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
    tableName: 'user',
    timestamps: true,
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Tables, set.');
    })
    .catch((err) => {
        console.error('Error synchronizing tables:', err);
    });
module.exports = {
    User
}