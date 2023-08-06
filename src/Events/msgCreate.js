const { Events, Message } = require('discord.js');
const { prefix } = require('../../config.json');
const rose = require('../bot');
module.exports = {
    name: Events.MessageCreate,
    on: true,
    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {
        if (message.author.bot) return;


        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = rose.reg_cmd.get(commandName)
            if (!command) return message.react('<a:CB_alfa_disgusting:1136568825303793675>').then(() => {
                message.reply('I dont have this command...')
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 1000);

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