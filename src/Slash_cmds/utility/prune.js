const { SlashCommandBuilder, PermissionFlagsBits, Interaction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Prune up to 99 messages.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Number of messages to prune')
				.setMinValue(1)
				.setMaxValue(100)).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages).setDMPermission(false),
	category: 'mod',
	/**
	 * 
	 * @param {Interaction} interaction 
	 * @returns 
	 */
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');
		if (interaction.user.id !== '952975852801523762') return;
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.reply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};