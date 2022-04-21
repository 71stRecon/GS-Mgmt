/* eslint-disable unicorn/no-array-reduce */

export default {
    slashPermissions
};

/**
 * @name slashPermissions
 * @description Handles permissions for slash commands.
 * @param {*} command The command object.
 * @param {*} guild The guild object.
 * @param {*} array The array of permissions.
 * @returns {Array} The array of permissions, capped to 9 roles + Guild Owner.
 */
export async function slashPermissions(command, guild, array)
{
    const Roles = (commandName) =>
    {
        const cmdPerms = array.find(
            (c) => c.name === commandName
        ).permission;
        if (!cmdPerms)
            return;

        return guild.roles.cache
            .filter((role) => role.permissions.has(cmdPerms) && !role.managed);
    };

    const fullPermissions = command.reduce((accumulator, command) =>
    {
        const roles = Roles(command.name);
        if (!roles)
            return accumulator;

        const permissions = [];
        permissions.push({ id: guild.ownerId, type: `USER`, permission: true });
        const temporary = roles.reduce((a, command) => [...a, { id: command.id, type: `ROLE`, permission: true }], []);
        permissions.push(...temporary.slice(0, 9)); // Fix for discord's max of 10 permissions per role

        return [...accumulator, { id: command.id, permissions }];
    }, []);

    await guild.commands.permissions.set({ fullPermissions });
}
