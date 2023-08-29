const { Events, Message } = require('discord.js');
const prefix = '-';
const rose = require('../bot');
const { User, Count } = require('../../db');
const randomExp = Math.floor(Math.random() * 4) + 3;

const saveUser = async (user) => {
    try {
        await user.save();
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleCommand = (message, commandPrefix) => {
    if (message.content.startsWith(commandPrefix)) {
        const args = message.content.slice(commandPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = rose.reg_cmd.get(commandName)
        if (!command) return;
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while executing the command.');
        }
    }
};

module.exports = {
    name: Events.MessageCreate,
    on: true,
    async execute(message) {
        if (message.author.bot) return;

        try {
            const [user, created] = await User.findOrCreate({
                where: { uid: message.author.id },
                defaults: {
                    name: `${message.author.username}#${message.author.discriminator}`
                }
            });

            user.messageCount += 1;
            if (!created) {
                user.chatXp += randomExp;
                const requireExp = Math.pow(user.chatLevel, 2) * 250;
                if (user.chatXp >= requireExp) {
                    user.chatLevel += 1;
                }
            }
            saveUser(user);
        } catch (err) {
            console.log(err)
        }

        try {
            const [user, created] = await Count.findOrCreate({
                where: { uid: message.author.id },
            });

            user.dailyMsg += 1;
            user.weeklyMsg += 1;
            saveUser(user);
        } catch (error) {
            console.error('Error:', error);
        }

        handleCommand(message, message.channel?.type === 1 ? "?" : prefix);
    },
};
