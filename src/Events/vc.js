
const { Events, EmbedBuilder } = require('discord.js');
const { User } = require('../../db');

module.exports = {

    name: Events.VoiceStateUpdate,
    on: true,
    async execute(oldState, newState) {
        if (!oldState.channel && newState.channel) { // User joins a voice channel
            newState.member.voiceStartTime = new Date(); // Store the start time
        } else if (oldState.channel && !newState.channel) { // User leaves a voice channel
            const userId = newState.member.id;
            const voiceStartTime = newState.member.voiceStartTime;

            if (voiceStartTime) {
                const voiceDuration = new Date() - voiceStartTime; // Calculate the duration
                const xpIncrement = Math.floor(voiceDuration / 1000); // Define the xp increment based on duration

                try {
                    const user = await User.findByPk(userId); // Find the user in the database
                    if (user) {
                        const requireExp = (Math.pow(user.vcLevel, 2) * 200) + user.vcLevel * 100;
                        user.vcXp += xpIncrement; // Update vcXp by incrementing it with xpIncrement
                        if (user.vcXp >= requireExp) {
                            user.vcLevel += 1;
                        }
                        await user.save()
                            .catch(err => {
                                console.log(err)
                            }); // Save the updated user in the database

                    }
                } catch (error) {
                    console.error(`Error updating vcXp and vcLevel for user ${userId}: ${error}`);
                }
            }
        }

    },
};
