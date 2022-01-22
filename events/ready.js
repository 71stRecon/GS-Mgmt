const utils = require(`../handlers/utils`);

module.exports = {
    name: `ready`,
    once: true,
    async execute(client)
    {
        // cache stuff (this doesn't take long at all)
        client.guilds.fetch()
            .then(function ()
            {
                console.log(`Guilds cached.`);
                // once guild is cached, let's cache the guild's roles
                client.guilds.cache.forEach(function (guild)
                {
                    guild.roles.fetch()
                        .then(function ()
                        {
                            console.log(`Roles cached for ${ guild.name }.`);
                        })
                        .catch(function (err)
                        {
                            console.error(`Error caching roles for ${ guild.name }.`, err);
                        });

                    // Cache channels
                    guild.channels.fetch()
                        .then(function ()
                        {
                            console.log(`Channels cached for ${ guild.name }.`);
                        })
                        .catch(function (err)
                        {
                            console.error(`Error caching channels for ${ guild.name }.`, err);
                        });

                    utils.deploySlashCommands(guild);
                });
            });

        if (client.guilds.cache.size === 0)
        {
            console.error(`Please add this bot to a server before starting it!\nhttps://discord.com/api/oauth2/authorize?client_id=${ client.user.id }&permissions=8&scope=bot%20applications.commands`);
            process.exit(1);
        }
        if (client.guilds.cache.size > 1)
        {
            console.error(`ERROR: This bot does not support multi-guild.\nPlease remove it from every guild except one.`);
            process.exit(1);
        }

        console.log(`Bot is ready!`);
    },
};
