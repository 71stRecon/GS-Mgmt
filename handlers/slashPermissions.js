module.exports = {
    slashPermissions
};

async function slashPermissions(command, guild, array)
{
    const Roles = (commandName) =>
    {
        const cmdPerms = array.find(
            (c) => c.name === commandName
        ).permission;
        if (!cmdPerms) return null;

        return guild.roles.cache
            .filter((role) => role.permissions.has(cmdPerms) && !role.managed);
    };

    const fullPermissions = command.reduce((accumulator, command) =>
    {
        const roles = Roles(command.name);
        if (!roles) return accumulator;

        const permissions = roles.reduce((a, command) => [...a, { id: command.id, type: `ROLE`, permission: true }], []);

        return [...accumulator, { id: command.id, permissions }];
    }, []);

    await guild.commands.permissions.set({ fullPermissions });
}
