import fs from "node:fs";
import SQLite from "better-sqlite3";
import { createRequire } from "node:module";
import Discord from "discord.js";

export const commands = [];

const require = createRequire(import.meta.url);
const sql = new SQLite(`./db.sqlite`);

// inital setup process and token validation
(async () =>
{
    await initSetup();

    const { token } = require(`./config.json`);
    if (token.length < 50)
    {
        console.log(`Invalid token length detected. Please check your config.json file.`);
        process.exit(1);
    }
})();
const { token } = require(`./config.json`);

export async function initSetup()
{
    if (fs.existsSync(`./config.json`))
        return; // we already have a config file

    fs.copyFileSync(`./config.json.example`, `./config.json`);

    var readlineSync = require(`readline-sync`);

    let token = ``;
    do
    {
        token = readlineSync.question(`Please enter your bot token: `, {
            hideEchoBack: true,
        });
    }
    while (token.length < 50);

    let seniorStaffID = ``;
    do
        seniorStaffID = readlineSync.question(`Enter your Senior Staff Role ID: `);
    while (seniorStaffID.length < 10);

    const config = require(`./config.json`);
    config.token = token.trim();
    config.seniorStaffID = seniorStaffID.trim();
    fs.writeFileSync(`./config.json`, JSON.stringify(config, undefined, 4)); // save settings to config
}

const client = new Discord.Client({
    partials: [`CHANNEL`],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

// load files
(async () =>
{
    // slash commands
    client.commands = new Discord.Collection();

    const commandFolders = fs.readdirSync(`./commands/`);

    for (const folder of commandFolders)
    {
        const commandFiles = fs.readdirSync(`./commands/${ folder }`).filter((file) => file.endsWith(`.js`));
        for (const file of commandFiles)
        {
            try
            {
                let command = await import(`./commands/${ folder }/${ file }`);
                command = command.default || command;
                client.commands.set(command.name, command);
                commands.push(command);
            }
            catch (error)
            {
                console.error(`Failed to load command ${ file }. Error: ${ error }`);
            }
        }
    }

    console.log(`Commands loaded.`);

    // events
    const eventFiles = fs.readdirSync(`./events`).filter((file) => file.endsWith(`.js`));
    for (const file of eventFiles)
    {
        let event = await import(`./events/${ file }`);
        event = event.default || event;
        if (event.once)
            client.once(event.name, (...ourArguments) => event.execute(...ourArguments, Discord, client));
        else
            client.on(event.name, (...ourArguments) => event.execute(...ourArguments, Discord, client));
    }

    sql.prepare(`CREATE TABLE IF NOT EXISTS updatingMessages (guildId TEXT, channelId TEXT, messageId TEXT);`).run();
})();

// catch errors
process.on(`unhandledRejection`, (error) =>
{
    console.error(`Unhandled Rejection:`, error);
});

client.login(token);
