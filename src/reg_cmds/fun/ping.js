


module.exports = {
    name: 'ping',
    execute: async (message, args) => {
        let channel = message.guild.channels.cache.get('1102598609653993493');
        if (!channel) channel = member.guild.channels.fetch('1102598609653993493');
        channel.send('ur mom');
    }
}