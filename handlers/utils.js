import { commands } from "../index.js";
import { slashPermissions } from "./slashPermissions.js";

export default {
    deploySlashCommands
};

/**
 * @name deploySlashCommands
 * @description Deploys slash commands.
 * @param {object} guild The guild Object.
 */
export async function deploySlashCommands(guild)
{
    const allCommands = commands;
    guild.commands.set(allCommands)
        .then(async (command) =>
        {
            slashPermissions(command, guild, allCommands);
        })
        .catch((error) =>
        {
            console.error(`Error setting slashcommands for ${ guild.name }.`, error);
        });
}
