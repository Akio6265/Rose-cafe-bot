const { EmbedBuilder, Message, ChannelType, userMention, roleMention, time, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
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
        try {

            const guild = rose.guilds.cache.get(gId);
            const category = guild.channels.cache.get(categoryId)
            // Check if the user has an existing ticket
            const existingChannel = guild.channels.cache.find(channel => channel.name === msg.author.tag);
            if (existingChannel) {
                return msg.channel.send(`❌ There is already a ticket opened by you!`)
                    .then(e => msg.react('❌'));

            };
            let member = guild.members.cache.get(msg.author.id);
            if (!member) member = await guild.members.fetch(msg.author.id);
            let rolesMap = member.roles.cache;
            if (!rolesMap) rolesMap = await member.roles.fetch();

            const roles = rolesMap.map((role) => roleMention(role.id)).join(' ');
            const created = time(member.user.createdAt, 'R');
            const joined = time(member.joinedAt, 'R');

            const claim = new ButtonBuilder()
                .setCustomId('claim')
                .setLabel('Claim')
                .setEmoji('🫳')
                .setStyle(ButtonStyle.Primary);

            const close = new ButtonBuilder()
                .setCustomId('close')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒');


            const comp = new ActionRowBuilder()
                .addComponents(claim, close);

            const mention = new EmbedBuilder()
                .setColor(0xe645b8)
                .setAuthor({
                    name: msg.author.username,
                    iconURL: msg.author.displayAvatarURL({ dynamic: true })
                })
                .setDescription(userMention(msg.author.id), ` Created ${created} and joined ${joined}`)
                .addFields({
                    name: "Roles",
                    value: roles,
                    inline: false
                })
                .setFooter({ text: `UserID: ${msg.author.id}` })
                .setTimestamp();

            // Create a new channel within the category, with the user's ID as the name
            const channel = await guild.channels.create({
                name: msg.author.username,
                type: ChannelType.GuildText,
                description: msg.author.id,
                parent: category,
                topic: `Ticket for ${msg.author.id}`,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: 'ViewChannel'
                    },
                    {
                        id: msg.author.id,
                        allow: ['ViewChannel']
                    },
                    {
                        id: '1088855389824618517',//staff role here
                        allow: ['ViewChannel']
                    }

                ]
            });
            channel.lockPermissions()
                .catch(e => channel.send('some error appeared'))
            channel.send({ embeds: [mention], components: [comp] })
                .then(e => {
                    msg.react('✅');
                    msg.channel.send(`Your ticket has been created <#${channel.id}> , Please wait for someone to respond.`);
                });
        } catch (err) {
            console.log(err)
            msg.reply('some error appeared, ping aki on the server.')
        }
    }
}