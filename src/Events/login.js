const { Events, ActivityType, EmbedBuilder, userMention } = require('discord.js');
const { Sequelize, Op } = require('sequelize');
const { User, Count } = require('../../db');

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
//reset fun
async function resetDaily() {
    try {
        const users = await Count.findAll();
        for (const user of users) {
            user.dailyMsg = 0;
            user.dailyVc = 0
            await user.save().catch(error => console.error('Error:', error));;
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
            user.weeklVc = 0;
            await user.save().catch(error => console.error('Error:', error));
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
        console.log(`${client.user.username} is live now`);
        client.user.setStatus('idel');
        client.user.setActivity("E-Girl Socials cute members", { type: ActivityType.Watching });

        const channel = await client.channels.cache.get("1111556882088341505"); // channel id here

        await channel.bulkDelete(2, true).catch(error => {
            console.error(error);
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
        const vc = new EmbedBuilder()
            .setTitle("Vc Leaderboard")
            .setColor(0xffa8ff)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .addFields(
                {
                    name: '__All-time leaderboard__',
                    value: userAllTimeVC.map((user, index) => `${index + 1}. ${userMention(user.uid)}> <a:arrowyellow:1038546631689252945> ${user.vcXp} xp in total.`).join('\n'),
                    inline: false
                },
                {
                    name: '__Weekly leaderboard__',
                    value: userLastWeekVc.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrow_purple:1142745834795048971> ${weeklyMsgvc[index]} minutes in vc this week.`).join('\n'),
                    inline: false
                },
                {
                    name: '__Daily leaderboard__',
                    value: userLastDayVC.map((user, index) => `${index + 1}. ${userMention(user.uid)}  <a:arrowegs:1038546626765144064> ${dailyMsgvc[index]} minutes in vc today.`).join('\n'),
                    inline: false
                }
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
                let time = new Date(Date.now() + (24 * 60 * 60 * 1000)).toLocaleString();
                let updatedChat = new EmbedBuilder()
                    .setTitle("Vc Leaderboard")
                    .setColor(0xffa8ff)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
                    .addFields(
                        {
                            name: '__All-time leaderboard__',
                            value: userAllTimeVC.map((user, index) => `${index + 1}. ${userMention(user.uid)}> <a:arrowyellow:1038546631689252945> ${user.vcXp} xp in total.`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Weekly leaderboard__',
                            value: userLastWeekVc.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrow_purple:1142745834795048971> ${weeklyMsgvc[index]} minutes in vc this week.`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Daily leaderboard__',
                            value: userLastDayVC.map((user, index) => `${index + 1}. ${userMention(user.uid)}  <a:arrowegs:1038546626765144064> ${dailyMsgvc[index]} minutes in vc today.`).join('\n'),
                            inline: false
                        }

                    )
                    .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
                    .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });

                await message.edit({ embeds: [updatedChat] });
                await resetWeekly();
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
        };
        for (const user of userLastDay) {
            let x = await Count.findOne({
                where: {
                    uid: user.uid
                }
            });
            let msg = x?.dailyMsg ?? "0"
            dailyMsg.push(msg);
        }
        // console.log(userAllTime)
        const chat = new EmbedBuilder()
            .setTitle("Chat Leaderboard")
            .setColor(0xffa8ff)
            .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
            .addFields(
                {
                    name: '__All-time leaderboard__',
                    value: userAllTime.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrowyellow:1038546631689252945> ${user.messageCount} messages in total.`).join('\n'),
                    inline: false
                },
                {
                    name: '__Weekly leaderboard__',
                    value: userLastWeek.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrow_purple:1142745834795048971> ${weeklyMsg[index]} messages this week.`).join('\n'),
                    inline: false
                },
                {
                    name: '__Daily leaderboard__',
                    value: userLastDay.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrowegs:1038546626765144064> ${dailyMsg[index]} messages today.`).join('\n'),
                    inline: false
                },
            )
            .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
            .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });


        await channel.send({
            embeds: [chat]
        }).then((message) => {
            let timer = 24 * 60 * 60 * 1000;
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
                };
                for (const user of userLastDay) {
                    let x = await Count.findOne({
                        where: {
                            uid: user.uid
                        }
                    });
                    let msg = x?.dailyMsg ?? "0"
                    dailyMsg.push(msg);
                }

                const updatedChat = new EmbedBuilder()
                    .setTitle("Chat Leaderboard")
                    .setColor(0xffa8ff)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif')
                    .addFields(
                        {
                            name: '__All-time leaderboard__',
                            value: userAllTime.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrowyellow:1038546631689252945> ${user.messageCount} messages in total.`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Weekly leaderboard__',
                            value: userLastWeek.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrow_purple:1142745834795048971> ${weeklyMsg[index]} messages this week.`).join('\n'),
                            inline: false
                        },
                        {
                            name: '__Daily leaderboard__',
                            value: userLastDay.map((user, index) => `${index + 1}. ${userMention(user.uid)} <a:arrowegs:1038546626765144064> ${dailyMsg[index]} messages today.`).join('\n'),
                            inline: false
                        },
                    )
                    .setImage('https://cdn.discordapp.com/attachments/1139856341381431376/1139985585411473408/divider1.gif')
                    .setFooter({ text: `This leaderboard will update again at ${time}`, iconURL: "https://cdn.discordapp.com/attachments/1139856341381431376/1139981548955910324/image0.gif" });

                await message.edit({ embeds: [updatedChat] });
                await resetDaily();
            }, timer);
        });

        setInterval(() => {
            resetWeekly();
        }, 7 * 24 * 60 * 60 * 1000 + 30000);
    },
};
