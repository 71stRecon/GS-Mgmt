module.exports = {
    name: 'ready',
    once: true,
    async execute(client, Discord)
    {
        // cache stuff (this doesn't take long at all)
        client.guilds.fetch()
            .then(function ()
            {
                // once guild is cached, let's cache the guild's roles
                const guildId = client.guilds.cache.first().id;
                const guild = client.guilds.cache.get(guildId);
                guild.roles.fetch()
                    .catch(function (err)
                    {
                        console.log('Could not cache roles.');
                    });
            })
            .catch(function (err)
            {
                console.log('Could not cache guilds.');
            });

        if (client.guilds.cache.size > 1)
        {
            throw new Error("This bot does not support multi-guild!");
        } else if (client.guilds.cache.size === 0)
        {
            throw new Error("Please add this bot to a server before starting it!");
        }

        console.log("Bot is ready!");
    },
};