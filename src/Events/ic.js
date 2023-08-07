const { Events, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {import('discord.js').Interaction} interaction  
     */
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.slash_cmd.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
        else if (interaction.isButton()) {
            const channel = interaction.channel;
            const user = interaction.user;
            if (interaction.customId === 'claim') {
                // Update channel permissions
                // await channel.permissionOverwrites.edit('1088855389824618517', {
                //     ViewChannel: false
                // });
                await channel.permissionOverwrites.edit(user.id, {
                    ViewChannel: true
                });
                // Send a response message
                interaction.reply({
                    content: `This ticket is claimed by <@${user.id}>`
                });
            }
            if (interaction.customId === 'close' && interaction.id !== user.id) {
                await channel.delete();
                user.send('Your ticket has been closed');
            }

        }
    }
};