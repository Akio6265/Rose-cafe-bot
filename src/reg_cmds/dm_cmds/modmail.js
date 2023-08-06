const { EmbedBuilder, Message, ChannelType } = require('discord.js')
const { gId, categoryId } = require('../../../config.json');
const rose = require('../../bot');

module.exports = {
    name: "create",
    description: ' creats a ticket',
    /**
     * 
     * @param {Message} msg 
     */
    execute: async (msg, args) => {
        const guild = rose.guilds.cache.get(gId);
        const category = guild.channels.cache.get(categoryId);

        // Create a new channel within the category, with the user's ID as the name
        const channel = await guild.channels.create({
            name: msg.author.username,
            type: ChannelType.GuildText,
            parent: category
        });
        channel.send(`New modmail thread started by ${msg.author.tag} (${msg.author.id}): ${msg.content}`);
    }
}