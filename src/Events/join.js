const { Events, GuildMember, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, userMention } = require('discord.js');
const { gId } = require('../../config.json')
module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(members) {
        if (members.guild.id !== gId) return;

        const member = await members.guild.members.fetch(members.id);
        const channel = await members.guild.channels.fetch('1145668742706122862');
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
            .setDescription(`**˚ ₊ <a:EGS_bow_pink:1139974472489783436> Welcome to E-Girl Social come chat﹒₊***\n** > 𓂃 .  [click here to chat were always active](https://discord.com/channels/1029523457240739860/1123552387760672778)**\n\n\n<a:EGSRAINBOW:1124928534549373008> ⸝⸝  [𓂃 . click to join our 24/7 active vcs](https://discord.gg/EDavG9p6Fd)`)
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setFooter({ text: 'E-Girl social wishes you a pleasent stay' });

        channel.send({
            embeds: [
                [welcome],
            ],
            content: `<a:EGS_CLOUD:1124928678535630849>  welcome come say hi in chat  ${userMention(member.user.id)} <a:EGSCLOUD_:1124928568976220190>`,
            components: [row]
        });


    }

};