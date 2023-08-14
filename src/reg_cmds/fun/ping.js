const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Message, userMention } = require('discord.js')


module.exports = {
    name: 'ping',
    /**
     * 
     * @param {Message} msg 
     */
    execute: async (msg, args) => {
        if (args.length === 0) return

        msg.reply('pong');


    }
}