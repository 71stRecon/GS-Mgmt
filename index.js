const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix, seniorStaffID } = require('./config.json');

function check_config_vars()
{
	let errors = "";

	if (token.length < 50)
		errors = errors + "- Invalid token detected\n";
	if (!prefix)
		errors = errors + "- No command prefixes\n";
	if (seniorStaffID.length < 10)
		errors = errors + `${ (seniorStaffID.length == 0 ? "- Blank Senior Staff Role ID" : "- Invalid Senior Staff Role ID") }\n`;

	if (errors.length > 0)
	{
		console.log('Missing required variables. Please check config.json.');
		console.log(errors);
		process.exit(1);
	}
}

check_config_vars();

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_BANS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
	]
});

// define command collections and add
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders)
{
	const commandFiles = fs.readdirSync(`./commands/${ folder }`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const command = require(`./commands/${ folder }/${ file }`);
		client.commands.set(command.name, command);
	}
}

// load event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles)
{
	const event = require(`./events/${ file }`);
	if (event.once)
	{
		client.once(event.name, (...args) => event.execute(...args, Discord, client));
	} else
	{
		client.on(event.name, (...args) => event.execute(...args, Discord, client));
	}
}

client.login(token);
