module.exports = {
    deploySlashCommands,
};

async function deploySlashCommands(guild)
{
    const { commands } = require(`../index`);
    const slashPermissions = require(`./slashPermissions`);
    guild.commands.set(commands)
        .then(async (command) =>
        {
            slashPermissions.slashPermissions(command, guild, commands);
        })
        .catch(function (err)
        {
            console.error(`Error setting slashcommands for ${ guild.name }.`, err);
        });
}
