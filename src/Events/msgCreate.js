const { Events, Message } = require('discord.js');
const prefix = '-'
const rose = require('../bot');
const { User, Count } = require('../../db');
const randomExp = Math.floor(Math.random() * 4) + 3;

module.exports = {
    name: Events.MessageCreate,
    on: true,
    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {
        if (message.author.bot) return;
        //chatXp handling
        try {
            // Find or create the user
            const [user, created] = await User.findOrCreate({
                where: { uid: message.author.id },
                defaults: {
                    name: message.author.username
                }
            });
            if (created) {
                user.messageCount += 1;
                await user.save();
            }
            else if (user) {
                user.messageCount += 1;
                user.chatXp += randomExp;
                const requireExp = Math.pow(user.chatLevel, 2) * 200;
                // console.log(`${requireExp},  ${user.chatXp}`)
                if (user.chatXp >= requireExp) {
                    user.chatLevel += 1;
                }
                await user.save()
                    .catch(err => {
                        console.log(err)
                    });
            };

        } catch (err) {
            console.log(err)
        }
        //daily weekly
        try {
            let userCount = await Count.findOne({ where: { uid: message.author.id } });

            if (!userCount) {
                userCount = await Count.create({
                    uid: message.author.id,
                });
            }
            userCount.dailyMsg += 1;
            userCount.weeklyMsg += 1;

            await userCount.save().catch(error => console.error('Error:', error));
        } catch (error) {
            console.error('Error:', error);
        };


        //dm handling
        if (message.content.startsWith("?") && message.channel.type === 1) {

            const args = message.content.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = rose.reg_cmd.get(commandName)
            if (!command) return message.channel.send("use ?create to create a ticket");
            try {
                command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('An error occurred while executing the command.');
            }
        }

        //commands handling
        if (message.content.startsWith(prefix) && message.channel.type === 0) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = rose.reg_cmd.get(commandName)
            if (!command) return message.react('<a:OHWOOOW:1038546514907250818>').then(() => {
                message.reply('I dont have this command...')
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 4000);

                    });
            }).catch(err => console.log(err));
            try {
                command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('An error occurred while executing the command.');
            }
        };

    },
};