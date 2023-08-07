const { EmbedBuilder, Message, ChannelType, userMention, roleMention, time } = require('discord.js')
const { gId, categoryId } = require('../../../config.json');
const rose = require('../../bot');
const moment = require('moment');

module.exports = {
    name: "create",
    description: ' creats a ticket',
    /**
     * 
     * @param {Message} msg 
     */
    execute: async (msg, args) => {
        try {

            const guild = rose.guilds.cache.get(gId);
            const category = guild.channels.cache.get(categoryId)
            // Check if the user has an existing ticket
            const existingChannel = guild.channels.cache.find(channel => channel.name === msg.author.tag);
            // if (existingChannel) {
            //     return msg.channel.send(`❌ There is already a ticket opened by you!`);
            // };
            let member = guild.members.cache.get(msg.author.id);
            if (!member) member = await guild.members.fetch(msg.author.id);
            let rolesMap = member.roles.cache;
            if (!rolesMap) rolesMap = await member.roles.fetch();

            const roles = rolesMap.map((role) => roleMention(role.id)).join(' ');



            const created = time(member.user.createdAt, 'R');
            const joined = time(member.joinedAt, 'R');
            const mention = new EmbedBuilder()
                .setColor(0xe645b8)
                .setAuthor({
                    name: msg.author.username,
                    iconURL: msg.author.displayAvatarURL({ dynamic: true })
                })
                .setTitle(userMention(msg.author.id))
                .addFields({
                    name: "Roles",
                    value: roles,
                    inline: false
                })
                .setDescription(`Created ${created} and joined ${joined}`)
                .setFooter({ text: `UserID: ${msg.author.id}` })
                .setTimestamp();

            // Create a new channel within the category, with the user's ID as the name
            const channel = await guild.channels.create({
                name: msg.author.username,
                type: ChannelType.GuildText,
                description: msg.author.id,
                parent: category,
                topic: `Ticket for ${msg.author.username}`
            });

            channel.send({ embeds: [mention] })
                .then(e => {
                    msg.react('✅');
                    msg.reply('Your ticket has been created, Please wait for someone to respond.');
                });
        } catch (err) {
            console.log(err)
            msg.reply('some error appeared, ping aki on the server.')
        }
    }
}