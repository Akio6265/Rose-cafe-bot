const { Events, GuildMember, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, userMention } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(members) {
        if (members.guild.id !== '1029523457240739860') return;

        const member = await members.guild.members.fetch(members.id);
        const channel = await members.guild.channels.fetch('1123552387760672778');
        const link = new ButtonBuilder()
            .setLabel('Click this!')
            .setURL('https://discord.gg/socializing')
            .setEmoji('<a:EGSCLOUD:1124928621694427156>')
            .setStyle(ButtonStyle.Link);

        const roles = new ButtonBuilder()
            .setLabel('Grab roles!')
            .setURL('https://discord.com/channels/1029523457240739860/1032468886530035802')
            .setEmoji('<a:EGSCLOUD:1124928621694427156>')
            .setStyle(ButtonStyle.Link);
        const vc = new ButtonBuilder()
            .setLabel('Create a vc!')
            .setURL('https://discord.com/channels/1029523457240739860/1056072538674970694')
            .setEmoji('<a:EGSCLOUD:1124928621694427156>')
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder()
            .addComponents(link, roles, vc);


        const welcome = new EmbedBuilder()
            .setColor(0xfab4e3)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .setAuthor({ name: `Welcome ${member.user.username} in E-Girl social!`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(':EGSCLOUD_: **Come chat with us in** https://discord.com/channels/1029523457240739860/1123552387760672778\n\n:EGS_CLOUD: [Come join us with VC!](https://discord.com/channels/1029523457240739860/1056072538674970694)\n\n:EGSCLOUD: **feel free to check out our giveaways **https://discord.com/channels/1029523457240739860/1133162151662604438 https://discord.com/channels/1029523457240739860/1129470784654557294 https://discord.com/channels/1029523457240739860/1139692436323565668')
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setFooter({ text: 'E-Girl social wishes you a pleasent stay' })
        channel.send({ content: `:1499sparkleheart: welcome ${userMention(member.user.id)} :1499sparkleheart:`, embeds: [welcome], components: [row] });


    }

};