const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is alive`);
        client.user.setStatus('idle');
        client.user.setActivity("E-Girl Socials cute members", { type: ActivityType.Watching });
    },
};