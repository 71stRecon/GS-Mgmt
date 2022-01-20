const fs = require(`fs`);

// inital setup process and token validation
(async () =>
{
    await initSetup();
    const { token } = require(`./config.json`);
    checkToken(token);
})();

const Discord = require(`discord.js`);
const { token } = require(`./config.json`);

async function initSetup()
{
    if (fs.existsSync(`./config.json`))
        return; // we already have a config file

    fs.copyFileSync(`./config.json.example`, `./config.json`);

    const prompt = require(`prompt-sync`)({ sigint: true });
    let token = ``;
    do
        token = prompt(`Please enter your bot token: `);
    while (token.length < 50);

    let seniorStaffID = ``;
    do
        seniorStaffID = prompt(`Enter your Senior Staff Role ID: `);
    while (seniorStaffID.length < 10);

    const config = require(`./config.json`);
    config.token = token.trim();
    config.seniorStaffID = seniorStaffID.trim();
    fs.writeFileSync(`./config.json`, JSON.stringify(config, null, 4)); // save settings to config
}

function checkToken(token)
{
    if (token.length < 50)
    {
        console.log(`Invalid token length detected. Please check your config.json file.`);
        process.exit(1);
    }
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
(() =>
{
    // slash commands
    exports.commands = [];
    client.commands = new Discord.Collection();
    const commandFolders = fs.readdirSync(`./commands`);
    for (const folder of commandFolders)
    {
        const commandFiles = fs.readdirSync(`./commands/${ folder }`).filter((file) => file.endsWith(`.js`));
        for (const file of commandFiles)
        {
            try
            {
                const command = require(`./commands/${ folder }/${ file }`);
                client.commands.set(command.name, command);
                this.commands.push(command);
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
        const event = require(`./events/${ file }`);
        if (event.once)
            client.once(event.name, (...args) => event.execute(...args, Discord, client));
        else
            client.on(event.name, (...args) => event.execute(...args, Discord, client));
    }
})();

process.on(`unhandledRejection`, (error) =>
{
    console.error(`Unhandled Rejection:`, error);
});

client.login(token);
