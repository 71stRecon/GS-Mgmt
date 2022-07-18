import { InteractionType } from "discord.js";

export default {
    name: `interactionCreate`,
    async execute(interaction, Discord, client)
    {
        if (interaction.type === InteractionType.ApplicationCommand
            || interaction.type === InteractionType.isContextMenu
            || interaction.type === InteractionType.isUserContextMenu
            || interaction.type === InteractionType.isMessageContextMenu)
        {
            const command = client.commands.get(interaction.commandName);
            try
            {
                return command.execute(interaction, client, Discord);
            }
            catch (error)
            {
                console.error(error);
            }
        }
    },
};
