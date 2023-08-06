const { EmbedBuilder } = require('discord.js')


module.exports = {
    name: 'say',
    execute: async (msg, args) => {
        if (!args) return message.reply('invalid value');
        const message = args.join(' ');
        msg.channel.send(message).then((e) => {
            msg.delete();
        })

    }
}