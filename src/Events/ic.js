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
    }
};