import fs from "node:fs";
import SQLite from "better-sqlite3";
import { createRequire } from "node:module";
import Discord from "discord.js";

// Setup the WebSocket to communicate with the launcher Application
import { WebSocketServer } from 'ws';

export const commands = [];

const require = createRequire(import.meta.url);
const sql = new SQLite(`./db.sqlite`);

const launcherSocket = new WebSocketServer({ port: 1337 });

/**
 * inital setup process and token validation
 */
async function init()
{
    await initSetup();

    const { token } = require(`./config.json`);
    if (token.length < 50)
    {
        // eslint-disable-next-line no-restricted-syntax
        console.log(`Invalid token length detected. Please check your config.json file.`);
        process.exit(1);
    }
}

await init();

const { token } = require(`./config.json`);

/**
 *
 */
export async function initSetup()
{
    if (fs.existsSync(`./config.json`))
        return; // we already have a config file

    fs.copyFileSync(`./config.json.example`, `./config.json`);

    var readlineSync = require(`readline-sync`);

    let token = ``;
    do
    {
        token = readlineSync.question(`Please enter your bot token (hidden): `, {
            hideEchoBack: true,
        });
    }
    while (token.length < 50);

    let iw4maurl = ``;
    do
        iw4maurl = readlineSync.question(`Enter your IW4MAdmin URL (Example: https://servers.71strecon.net) : `);
    while (!iw4maurl.startsWith(`http`));
    if (iw4maurl.endsWith(`/`))
        iw4maurl = iw4maurl.slice(0, -1);
    iw4maurl += `/api/server/`;

    const config = require(`./config.json`);
    config.token = token.trim();
    config.iw4mainstance = iw4maurl.trim();
    fs.writeFileSync(`./config.json`, JSON.stringify(config, undefined, 4)); // save settings to config
}

const client = new Discord.Client({
    partials: [Discord.Partials.Channel],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
    ],
});

/**
 * load files
 */
async function loadEventsAndCommands()
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

    // eslint-disable-next-line no-restricted-syntax
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
}

await loadEventsAndCommands();

// catch errors
process.on(`unhandledRejection`, (error) =>
{
    console.error(`Unhandled Rejection:`, error);
});

client.login(token);

// WebSocket Events

launcherSocket.on(`connection`, (socket) =>
{
    socket.on(`message`, (data) =>
    {
        var message = JSON.parse(data); // We're always going to expect this as a json string

        for (const thisMessage of message)
        {
            switch (thisMessage.header)
            {
                case `updatecomplete`: {
                    var status = thisMessage.body;
                    // eslint-disable-next-line no-restricted-syntax
                    console.log(`Launcher updates completed`);
                    break;
                }
                case `updateconfirmed`: {
                    // launcher handshake confirming it's updating.
                    // eslint-disable-next-line no-restricted-syntax
                    console.log(`Launcher updates in progress`);
                    break;
                }
                case `updateerror`: {
                    console.error(`Launcher Error::${ status }`);
                    break;
                }
            }
        }
    });
});

/**
 * @param {object} data The data to send
 */
export function SendPacket(data)
{
    for (const client of launcherSocket.clients)
    {
        if (client.readyState === client.WebSocket.OPEN)
            client.send(JSON.stringify(data));
    }
}
