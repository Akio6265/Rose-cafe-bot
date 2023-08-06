const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Select a member to mute.')
        .addUserOption(option => option.setName('target').setDescription('who is getting on your nerves').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('duration').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('and reason').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setDMPermission(false),
    category: 'mod',
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const time = interaction.options.getString('time')
        const reason = interaction.options.getString('reason') ?? "no reason provided"
        const cTime = ms(time) ?? 3600;

        const success = new EmbedBuilder()
            .setColor(0x9cff63)
            .setTitle('successfully muted')
            .addFields(
                { name: "user", value: `<@${member.id}>`, inline: false },
                { name: "time", value: time, inline: false },
                { name: "reason", value: reason, inline: false }
            )
            .setTimestamp()

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return await interaction.reply('lol you cant do that');
        }
        if (!cTime) console.log('give time properly')
        try {
            await member.timeout(cTime, reason);
            await interaction.reply({ embeds: [success] });
            await member.send({ embeds: [success] })

        } catch (error) {
            console.log(error)
            await interaction.reply('missing permission')
        }

    },
};