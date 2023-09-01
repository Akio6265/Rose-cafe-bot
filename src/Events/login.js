const { Events, ActivityType, EmbedBuilder, time } = require('discord.js');
const { Sequelize, Op } = require('sequelize');
const { User, Count } = require('../../db');
const { lb } = require('../../config.json')

//reset fun
async function resetDaily() {
    try {
        const users = await Count.findAll();
        for (const user of users) {
            user.dailyMsg = 0;
            user.dailyVc = 0
            await user.save().catch(error => console.error('Error:', error));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
async function resetWeekly() {
    try {
        const users = await Count.findAll();
        for (const user of users) {
            user.weeklyMsg = 0;
            user.weeklyVc = 0;
            await user.save()
                .catch(error => console.error('Error:', error));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// ...
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is alive now`);
        client.user.setStatus('idel');
        client.user.setActivity("E-Girl Socials cute members", { type: ActivityType.Watching });

        const channel = await client.channels.cache.get(lb); // channel id here

        await channel.bulkDelete(3, true).catch(error => {
            console.error(error);
        });
        let timeStamp = `last updated ${time(new Date(), "R")}`;

        let oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDay() - 1);

        //vc

        let userLastWeekVc = await Count.findAll({
            include: [User],

            order: [
                ['weeklyVc', 'DESC']
            ],
            limit: 10
        });
        let userLastDayVC = await Count.findAll({
            include: [User],

            order: [
                ['dailyVc', 'DESC'],

            ],
            limit: 10
        });
        let userAllTimeVC = await User.findAll({
            order: [
                ["vcLevel", "DESC"],
                ["vcXp", 'DESC']
            ],
            limit: 10
        });
        const weeklyMsgvc = [];
        const dailyMsgvc = [];
        for (const user of userLastWeekVc) {
            let x = await Count.findOne({
                where: {
                    uid: user.uid
                }
            });
            let msg = x?.weeklyVc ?? "0"
            weeklyMsgvc.push(msg);
        };
        for (const user of userLastDayVC) {
            let x = await Count.findOne({
                where: {
                    uid: user.uid
                }
            });
            let msg = x?.dailyVc ?? "0"
            dailyMsgvc.push(msg);
        }
        const defaultValue = "No user";
        const vc = new EmbedBuilder()
            .setTitle("Vc Leaderboard")
            .setColor(0xffa8ff)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .addFields(
                {
                    name: '__All-time leaderboard__',
                    value: userAllTimeVC.length > 0 ? userAllTimeVC.map((user, index) => `${index + 1}. ${user.name} <a:arrowyellow:1038546631689252945> ${user.vcXp} xp in total.`).join('\n') : defaultValue,
                    inline: false
                },
                {
                    name: '__Weekly leaderboard__',
                    value: userLastWeekVc.length > 0 ? userLastWeekVc.map((user, index) => `${index + 1}. ${user.User?.name ?? user.uid} <a:arrow_purple:1142745834795048971> ${weeklyMsgvc[index]} minutes in vc this week.`).join('\n') : defaultValue,
                    inline: false
                },
                {
                    name: '__Daily leaderboard__',
                    value: userLastDayVC.length > 0 ? userLastDayVC.map((user, index) => `${index + 1}. ${user.User?.name ?? user.uid}  <a:arrowegs:1038546626765144064> ${dailyMsgvc[index]} minutes in vc today.`).join('\n') : defaultValue,
                    inline: false
                }
            )
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setTimestamp()
            .setFooter({ text: `This leaderboard updates every 24 hour`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });


        channel.send({
            embeds: [vc],
            content: timeStamp
        }).then((message) => {
            setInterval(async () => {
                let oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                let oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDay() - 1);

                let userLastWeekVc = await Count.findAll({
                    include: [User],
                    order: [
                        ['weeklyVc', 'DESC']

                    ],
                    limit: 10
                });
                let userLastDayVC = await Count.findAll({
                    include: [User],
                    order: [
                        ['dailyVc', 'DESC']

                    ],
                    limit: 10
                });
                let userAllTimeVC = await User.findAll({
                    order: [
                        ["vcLevel", "DESC"],
                        ["vcXp", 'DESC']
                    ],
                    limit: 10
                });
                const weeklyMsgvc = [];
                const dailyMsgvc = [];
                for (const user of userLastWeekVc) {
                    let x = await Count.findOne({
                        where: {
                            uid: user.uid
                        }
                    });
                    let msg = x?.weeklyVc ?? "0"
                    weeklyMsgvc.push(msg);
                };
                for (const user of userLastDayVC) {
                    let x = await Count.findOne({
                        where: {
                            uid: user.uid
                        }
                    });
                    let msg = x?.dailyVc ?? "0"
                    dailyMsgvc.push(msg);
                }
                let timeStamp = `last updated ${time(new Date(), "R")}`;
                let updatedChat = new EmbedBuilder()
                    .setTitle("Vc Leaderboard")
                    .setColor(0xffa8ff)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
                    .addFields(
                        {
                            name: '__All-time leaderboard__',
                            value: userAllTimeVC.length > 0 ? userAllTimeVC.map((user, index) => `${index + 1}. ${user.name} <a:arrowyellow:1038546631689252945> ${user.vcXp} xp in total.`).join('\n') : defaultValue,
                            inline: false
                        },
                        {
                            name: '__Weekly leaderboard__',
                            value: userLastWeekVc.length > 0 ? userLastWeekVc.map((user, index) => `${index + 1}. ${user.User?.name ?? user.uid} <a:arrow_purple:1142745834795048971> ${weeklyMsgvc[index]} minutes in vc this week.`).join('\n') : defaultValue,
                            inline: false
                        },
                        {
                            name: '__Daily leaderboard__',
                            value: userLastDayVC.length > 0 ? userLastDayVC.map((user, index) => `${index + 1}. ${user.User?.name ?? user.uid}  <a:arrowegs:1038546626765144064> ${dailyMsgvc[index]} minutes in vc today.`).join('\n') : defaultValue,
                            inline: false
                        }

                    )
                    .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
                    .setTimestamp()
                    .setFooter({ text: `This leaderboard updates every 24 hour`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });

                await message.edit({
                    embeds: [updatedChat],
                    content: timeStamp
                });
            }, 24 * 60 * 60 * 1000);
        });


        //chat
        let userLastWeek = await Count.findAll({
            include: [User],

            order: [

                ['weeklyMsg', 'DESC']
            ],
            limit: 10
        });
        let userLastDay = await Count.findAll({
            include: [User],

            order: [
                ['dailyMsg', 'DESC'],

            ],
            limit: 10
        });
        let userAllTime = await User.findAll({
            order: [
                ['messageCount', 'DESC'],
                ["chatXp", 'DESC']
            ],
            limit: 10
        });
        const weeklyMsg = [];
        const dailyMsg = [];
        for (const user of userLastWeek) {
            let x = await Count.findOne({
                where: {
                    uid: user.uid
                }
            });
            let msg = x?.weeklyMsg ?? "0"
            weeklyMsg.push(msg);
        }
        for (const user of userLastDay) {
            let x = await Count.findOne({
                where: {
                    uid: user.uid
                }
            });
            let msg = x?.dailyMsg ?? "0"
            dailyMsg.push(msg);
        }

        const chat = new EmbedBuilder()
            .setTitle("Chat Leaderboard")
            .setColor(0xffa8ff)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .addFields(
                {
                    name: '__All-time leaderboard__',
                    value: userAllTime.length > 0 ? userAllTime.map((user, index) => `${index + 1}. ${user.name} <a:arrowyellow:1038546631689252945> ${user.messageCount} messages in total.`).join('\n') : defaultValue,
                    inline: false
                },
                {
                    name: '__Weekly leaderboard__',
                    value: userLastWeek.length > 0 ? userLastWeek.map((user, index) => `${index + 1}. ${user.User.name} <a:arrow_purple:1142745834795048971> ${weeklyMsg[index]} messages this week.`).join('\n') : defaultValue,
                    inline: false
                },
                {
                    name: '__Daily leaderboard__',
                    value: userLastDay.length > 0 ? userLastDay.map((user, index) => `${index + 1}. ${user.User.name} <a:arrowegs:1038546626765144064> ${dailyMsg[index]} messages today.`).join('\n') : defaultValue,
                    inline: false
                },
            )
            .setTimestamp()
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setFooter({ text: `This leaderboard updates every 24 hour`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });


        await channel.send({
            embeds: [chat],
            content: timeStamp
        }).then((message) => {
            let timer = 24 * 60 * 60 * 1000;
            channel.send({ content: "Sorry about the miscalculation of daily and weekly members. It will be fixed eventually" })
                .then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, timer);
                })
            setInterval(async () => {
                let timeStamp = `last updated ${time(new Date(), "R")}`;
                let oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                let oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDay() - 1);

                let userLastWeek = await Count.findAll({
                    include: [User],
                    order: [
                        ['weeklyMsg', 'DESC']
                    ],
                    limit: 10
                });
                let userLastDay = await Count.findAll({
                    include: [User],
                    order: [
                        ['dailyMsg', 'DESC'],

                    ],
                    limit: 10
                });
                let userAllTime = await User.findAll({
                    order: [
                        ['messageCount', 'DESC'],
                        ["chatXp", 'DESC']
                    ],
                    limit: 10
                });
                const weeklyMsg = [];
                const dailyMsg = [];
                for (const user of userLastWeek) {
                    let x = await Count.findOne({
                        where: {
                            uid: user.uid
                        }
                    });
                    let msg = x?.weeklyMsg ?? "0";
                    weeklyMsg.push(msg);
                }
                for (const user of userLastDay) {
                    let x = await Count.findOne({
                        where: {
                            uid: user.uid
                        }
                    });
                    let msg = x?.dailyMsg ?? "0";
                    dailyMsg.push(msg);
                }

                const updatedChat = new EmbedBuilder()
                    .setTitle("Chat Leaderboard")
                    .setColor(0xffa8ff)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
                    .addFields(
                        {
                            name: '__All-time leaderboard__',
                            value: userAllTime.length > 0 ? userAllTime.map((user, index) => `${index + 1}. ${user.name} <a:arrowyellow:1038546631689252945> ${user.messageCount} messages in total.`).join('\n') : defaultValue,
                            inline: false
                        },
                        {
                            name: '__Weekly leaderboard__',
                            value: userLastWeek.length > 0 ? userLastWeek.map((user, index) => `${index + 1}. ${user.User.name} <a:arrow_purple:1142745834795048971> ${weeklyMsg[index]} messages this week.`).join('\n') : defaultValue,
                            inline: false
                        },
                        {
                            name: '__Daily leaderboard__',
                            value: userLastDay.length > 0 ? userLastDay.map((user, index) => `${index + 1}. ${user.User.name} <a:arrowegs:1038546626765144064> ${dailyMsg[index]} messages today.`).join('\n') : defaultValue,
                            inline: false
                        },
                    )
                    .setTimestamp()
                    .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
                    .setFooter({ text: `This leaderboard updates every 24 hour`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });

                await message.edit({
                    embeds: [updatedChat],
                    content: timeStamp
                });
            }, timer);
        });

        setInterval(async () => {
            await resetDaily();
        }, 24 * 60 * 60 * 1000);
        setInterval(async () => {
            await resetWeekly();
        }, 7 * 24 * 60 * 60 * 1000);
    },
};
