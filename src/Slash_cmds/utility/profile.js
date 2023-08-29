const { SlashCommandBuilder, AttachmentBuilder, Interaction, time, GuildMember } = require('discord.js');
const canvacord = require("canvacord");
const { User } = require('../../../db');
const { Op } = require('sequelize');
/**
 * @param {GuildMember} member
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Check your server profile'),
    category: 'utility',
    /**
     * 
     * @param {Interaction} interaction 
     * @returns 
     */
    async execute(interaction) {
        const img = interaction.user.avatarURL();
        const userData = await User.findOne({
            where: {
                uid: interaction.user.id
            }
        });
        const Rank = await User.count({
            where: {
                chatXp: { [Op.gt]: userData.chatXp },
            },
        });
        const { member, user } = interaction;
        const requireExp = Math.pow(userData.chatLevel, 2) * 250 - Math.pow(userData.chatLevel - 1, 2) * 250;
        const xp = userData.chatXp - Math.pow(userData.chatLevel - 1, 2) * 250;
        const tag = user.username;
        const status = member.presence?.status ?? "online"
        const username = member.nickname ?? user.globalName ?? user.username ?? "??";
        const rank = new canvacord.Rank()
            .setAvatar(img)
            .setUsername(username)
            .setStatus(status)
            .setCurrentXP(xp)
            .setRequiredXP(requireExp)
            .setProgressBar("#7482a3")
            .setProgressBarTrack("#ffffff", "COLOR")
            .setBackground('IMAGE', 'https://w.wallhaven.cc/full/2y/wallhaven-2yo1x6.png')
            .setRank(Rank + 1)
            .setOverlay("#5c657a", 0.65)
            .setDiscriminator(tag)
            .setLevel(userData.chatLevel)
        try {


            rank.build()
                .then(data => {
                    const buffer = Buffer.from(data);
                    const attachment = new AttachmentBuilder(buffer, "RankCard.png");
                    interaction.reply({
                        files: [attachment]
                    })
                        .catch(err => console.err(err));
                })
                .catch(err => console.err(err))
                ;
        } catch (err) {
            console.err(err)
        }

    },
};