const { Events, GuildMember } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        member.send('welcome to our goofy land');
        let channel = member.guild.channels.cache.get('1102598609653993493');
        if (!channel) channel = member.guild.channels.fetch('1102598609653993493');
        channel.send(member.user.username);
    }

};