const { prefix } = require(`../config.json`);

module.exports = {
    name: `messageCreate`,
    async execute(message, Discord, client)
    {
        if (message.channel.type.toLowerCase() === `dm`) return; // Don't respond/attempt to run commands in DMs.

        // Prepare multiple prefix(es)
        const isPrefix = prefix.find((p) => message.content.startsWith(p));

        // Command Handling
        if ((isPrefix)
            && !message.author.bot)
        {
            if (message.content === `${ isPrefix }`) return; // Don't try and do anything if you just enter a single character that happens to be a prefix.
            const args = message.content.slice(isPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName)
                || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return;

            if (command.permissions)
            {
                const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.permissions))
                    if (message.deletable) message.delete().catch(console.error);
            }

            if (command.args && !args.length)
                if (message.deletable) message.delete().catch(console.error);

            try
            {
                command.execute(message, args, Discord, client);
                if (message.deletable) message.delete().catch(console.error);
            } catch (error)
            {
                if (message.deletable) message.delete().catch(console.error);
            }
        }
    }
};
