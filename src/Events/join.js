const { Events, GuildMember, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        if (member.guild.id !== '1135542046711631963') return;
        const welcome = new EmbedBuilder()
            .setColor(0xde2e1b)
            .setTitle('Welcome', member.user.username)
            .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setImage('https://w.wallhaven.cc/full/2y/wallhaven-2yoyj9.jpg')
        member.send({ embeds: [welcome] });
        let channel = member.guild.channels.cache.get('1136265430869217340');
        if (!channel) channel = member.guild.channels.fetch('1136265430869217340');
        channel.send({ embeds: [welcome] });
    }

};