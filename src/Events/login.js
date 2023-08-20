const { Events, ActivityType, EmbedBuilder } = require('discord.js');
const Sequelize = require('sequelize');
const { User } = require('../../db');

//chat
async function getUser(startDate, endDate) {
    const result = await User.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.between]: [startDate, endDate]
            }
        },
        order: [
            ['messageCount', 'DESC']
        ],
        limit: 10
    });
    return result;
}
//vc
async function getUserVc(startDate, endDate) {
    const result = await User.findAll({
        where: {
            createdAt: {
                [Sequelize.Op.between]: [startDate, endDate]
            }
        },
        order: [
            ['vcXp', 'DESC']
        ],
        limit: 10
    });
    return result;
}
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is live now`);
        client.user.setStatus('idel');
        client.user.setActivity("E-Girl Socials cute members", { type: ActivityType.Watching });

        const channel = await client.channels.cache.get("1111556882088341505"); // channel id here

        await channel.bulkDelete(2, true).catch(error => {
            console.error(error)
        });
        let time = new Date(Date.now() + (24 * 60 * 60 * 1000)).toLocaleString();

        let oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDay() - 1);

        //vc
        let userLastWeekVc = await getUserVc(oneWeekAgo, new Date()) ?? "No one yet lol";
        let userLastDayVC = await getUserVc(oneDayAgo, new Date()) ?? "No one yet";
        let userAllTimeVC = await User.findAll({
            order: [
                ["vcLevel", "DESC"],
                ["vcXp", 'DESC']
            ],
            limit: 10
        });

        const vc = new EmbedBuilder()
            .setTitle("Vc Leaderboard")
            .setColor(0xffa8ff)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .addFields(
                {
                    name: '__All-time leaderboard__',
                    value: userAllTimeVC.map((user, index) => `${index + 1}. ${user.name} <a:TH_arrow2:1142515854685249626> ${user.vcXp} exp`).join('\n'),
                    inline: false
                },
                {
                    name: '__Weekly leaderboard__',
                    value: userLastWeekVc.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                    inline: false
                },
                {
                    name: '__Daily leaderboard__',
                    value: userLastDayVC.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                    inline: false
                },
            )
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });


        channel.send({
            embeds: [vc]
        }).then((message) => {
            setInterval(async () => {
                let oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                let oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDay() - 1);

                let userLastWeekVc = await getUserVc(oneWeekAgo, new Date()) ?? "No one yet lol";
                let userLastDayVC = await getUserVc(oneDayAgo, new Date()) ?? "No one yet";
                let userAllTimeVC = await User.findAll({
                    order: [
                        ["vcLevel", "DESC"],
                        ["vcXp", 'DESC']
                    ],
                    limit: 10
                });
                let time = new Date(Date.now() + (24 * 60 * 60 * 1000)).toLocaleString();
                let updatedChat = new EmbedBuilder()
                    .setTitle("Vc Leaderboard")
                    .setColor(0xffa8ff)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
                    .addFields(
                        {
                            name: '__All-time leaderboard__',
                            value: userAllTimeVC.map((user, index) => `${index + 1}. ${user.name} <a:TH_arrow2:1142515854685249626> ${user.vcXp} exp`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Weekly leaderboard__',
                            value: userLastWeekVc.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Daily leaderboard__',
                            value: userLastDayVC.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                            inline: false
                        },

                    )
                    .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
                    .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });

                await message.edit({ embeds: [updatedChat] });
            }, 24 * 60 * 60 * 1000);
        });


        //chat



        let userLastWeek = await getUser(oneWeekAgo, new Date()) ?? "No one yet lol";
        let userLastDay = await getUser(oneDayAgo, new Date()) ?? "No one yet";
        let userAllTime = await User.findAll({
            order: [
                ['messageCount', 'DESC'],
                ["chatXp", 'DESC']
            ],
            limit: 10
        });

        // console.log(userAllTime)
        const chat = new EmbedBuilder()
            .setTitle("Chat Leaderboard")
            .setColor(0xffa8ff)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .addFields(
                {
                    name: '__All-time leaderboard__',
                    value: userAllTime.map((user, index) => `${index + 1}. ${user.name} <a:TH_arrow2:1142515854685249626> ${user.messageCount} messages`).join('\n'),
                    inline: false
                },
                {
                    name: '__Weekly leaderboard__',
                    value: userLastWeek.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                    inline: false
                },
                {
                    name: '__Daily leaderboard__',
                    value: userLastDay.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                    inline: false
                },
            )
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });


        await channel.send({
            embeds: [chat]
        }).then((message) => {
            setInterval(async () => {

                let time = new Date(Date.now() + (24 * 60 * 60 * 1000)).toLocaleString();

                let oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                let oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDay() - 1);

                let userLastWeek = await getUser(oneWeekAgo, new Date()) ?? "No one yet lol";
                let userLastDay = await getUser(oneDayAgo, new Date()) ?? "No one yet";
                let userAllTime = await User.findAll({
                    order: [
                        ['messageCount', 'DESC'],
                        ["chatXp", 'DESC']
                    ],
                    limit: 10
                });
                const updatedChat = new EmbedBuilder()
                    .setTitle("Chat Leaderboard")
                    .setColor(0xffa8ff)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
                    .addFields(
                        {
                            name: '__All-time leaderboard__',
                            value: userAllTime.map((user, index) => `${index + 1}. ${user.name} <a:TH_arrow2:1142515854685249626> ${user.messageCount} messages`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Weekly leaderboard__',
                            value: userLastWeek.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Daily leaderboard__',
                            value: userLastDay.map((user, index) => `${index + 1}. ${user.name}`).join('\n'),
                            inline: false
                        },

                    )
                    .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
                    .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });

                await message.edit({ embeds: [updatedChat] });
            }, 24 * 60 * 60 * 1000);
        });




    },
};
