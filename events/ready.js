import SQLite from "better-sqlite3";
import * as utils from "../handlers/utils.js";
import { updateMessage } from "../commands/gs/stats.js";

const sql = new SQLite(`./db.sqlite`);

export default {
    name: `ready`,
    once: true,
    async execute(client)
    {
        // cache stuff (this doesn't take long at all)
        await client.guilds.fetch()
            .then(async function ()
            {
                console.log(`Guilds cached.`);
                // once guild is cached, let's cache the guild's roles
                for (const guild of client.guilds.cache.values())
                {
                    await guild.roles.fetch()
                        .then(function ()
                        {
                            console.log(`Roles cached for ${ guild.name }.`);
                        })
                        .catch(function (error)
                        {
                            console.error(`Error caching roles for ${ guild.name }.`, error);
                        });

                    // Cache channels
                    await guild.channels.fetch()
                        .then(function ()
                        {
                            console.log(`Channels cached for ${ guild.name }.`);
                        })
                        .catch(function (error)
                        {
                            console.error(`Error caching channels for ${ guild.name }.`, error);
                        });

                    await utils.deploySlashCommands(guild);
                }
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

        // Every minute update message
        setInterval(async function ()
        {
            const databaseMeta = await sql.prepare(`SELECT * FROM updatingMessages`).raw().all();
            for (const meta of databaseMeta)
            {
                const guildId = meta[0];
                const channelId = meta[1];
                const messageId = meta[2];
                await updateMessage(guildId, channelId, messageId, false, client);
            }
        }, 5000);

        console.log(`Bot is ready!`);
    },
};
