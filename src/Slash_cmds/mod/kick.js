const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member to kick.')
		.addUserOption(option => option.setName('target').setDescription('who is being annoying?').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('and reason').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false),
	category: 'mod',
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		const reason = interaction.options.getString('reason') ?? "no reason provided"
		if (member.id === interaction.user.id) return interaction.reply(';-; you cant do this vro ');
		const success = new EmbedBuilder()
			.setColor(0x9cff63)
			.setTitle('successfully kicked')
			.addFields(
				{ name: "user", value: `<@${member.id}>`, inline: false },
				{ name: "reason", value: reason, inline: false }
			)
			.setTimestamp()
		try {
			await interaction.guild.members.kick(member);
			await interaction.reply({ embeds: [success] });
			await member.send({ embeds: [success] });

		} catch (error) {
			console.log(error)
			await interaction.reply('missing permission')
		}

	},
};