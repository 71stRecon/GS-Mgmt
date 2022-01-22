module.exports = {
    name: `interactionCreate`,
    async execute(interaction, Discord, client)
    {
        if (interaction.isCommand())
        {
            const command = client.commands.get(interaction.commandName);
            try
            {
                return command.execute(interaction, client, Discord);
            } catch (error)
            {
                console.error(error);
            }
        }
    },
};
