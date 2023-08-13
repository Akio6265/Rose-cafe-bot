const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Message, userMention } = require('discord.js')


module.exports = {
    name: 'ping',
    /**
     * 
     * @param {Message} msg 
     */
    execute: async (msg, args) => {
        if (!args) return message.reply('invalid value');
        const message = args.join(' ');
        msg.channel.send(message).then((e) => {
            msg.delete();
        })


    }
}