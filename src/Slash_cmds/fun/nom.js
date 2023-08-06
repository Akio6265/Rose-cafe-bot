const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nom')
        .setDescription('nom nom'),
    category: "fun",
    execute: async (inter) => {
        inter.reply('*noms back*')
    }
}