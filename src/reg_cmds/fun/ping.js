const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')


module.exports = {
    name: 'say',
    execute: async (msg, args) => {
        // if (!args) return message.reply('invalid value');
        // const message = args.join(' ');
        // msg.channel.send(message).then((e) => {
        //     msg.delete();
        // })
        const link = new ButtonBuilder()
            .setLabel('link')
            .setURL('https://discord.com/channels/1139827596251631616/1139863164230569994')
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder()
            .addComponents(link);
        const welcome = new EmbedBuilder()
            .setColor(0xde2e1b)
            .setTitle('Welcome user in E-girls social!')
            // .setAuthor({ name: msg.user.username, iconURL: msg.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('tell me what to put here')
            .addFields({
                name: ' ',
                value: 'some text',
                inline: false
            })
            .setImage('https://w.wallhaven.cc/full/2y/wallhaven-2yoyj9.jpg')
        msg.channel.send({ embeds: [welcome], components: [row] });


    }
}