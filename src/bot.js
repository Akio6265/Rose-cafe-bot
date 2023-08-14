const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('../config.json')


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
});
client.slash_cmd = new Collection();
client.reg_cmd = new Collection();
module.exports = client;


//Events handler
const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}
//slash commands handler

const slash_cmd_Folder = path.join(__dirname, 'Slash_cmds');
const sub_folders_array = fs.readdirSync(slash_cmd_Folder);

for (const subFolder of sub_folders_array) {
    const sub_folder_path = path.join(slash_cmd_Folder, subFolder)
    const files_array = fs.readdirSync(sub_folder_path).filter(e => e.endsWith('.js'));

    for (const file of files_array) {
        const cmdPath = path.join(sub_folder_path, file);
        const command = require(cmdPath);
        if ('data' in command && 'execute' in command) {
            client.slash_cmd.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${cmdPath} is missing a required "data" or "execute" property.`);
        }
    }
}
//regular commands handler

const cmd = path.join(__dirname, 'reg_cmds');
const sub_cmds_array = fs.readdirSync(cmd);

for (const sub_folder of sub_cmds_array) {
    const subCommandPath = path.join(cmd, sub_folder)
    const cmdFilesArray = fs.readdirSync(subCommandPath)
    for (const Files of cmdFilesArray) {
        const cmdPath = path.join(subCommandPath, Files)
        const command = require(cmdPath)
        client.reg_cmd.set(command.name, command);
    }
}

client.login(token)