import SQLite from "better-sqlite3";
import st from "string-table";
import { createRequire } from "node:module";
import fetch from "node-fetch";

const require = createRequire(import.meta.url);
const { seniorStaffID, iw4mainstance } = require(`../../config.json`);
const sql = new SQLite(`./db.sqlite`);

export default {
    name: `statsmsg`,
    description: `Sends stats message.`,
    defaultPermission: false,
    permission: [`KICK_MEMBERS`],
    options: [
        {
            name: `channel`,
            description: `Where?`,
            type: `CHANNEL`,
            channelTypes: [`GUILD_TEXT`],
            required: true,
        },
    ],

    async execute(interaction, client)
    {
        await interaction.deferReply({ ephemeral: true });

        const seniorStaff = interaction.guild.roles.cache.find((r) => r.id === seniorStaffID);
        const guildOwner = interaction.guild.ownerId;
        if (!interaction.member.roles.cache.has(seniorStaff.id) && interaction.member.id !== guildOwner)
            return interaction.followUp(`You do not have permission to use this command.`);

        const channel = interaction.options.getChannel(`channel`);
        const channelId = channel.id;

        await updateMessage(interaction.guild.id, channelId, undefined, true, client);
        interaction.followUp(`Sent Stats Message.`);
    }
};

export async function updateMessage(guildId, channelId, messageId, isFresh, client)
{
    const response = await fetch(`${ iw4mainstance }`).catch((error) =>
    {
        console.error(error);
    });
    if (!response.ok)
        return; // Bail out if iw4ma is down
    const json = await response.json();

    const data = [];
    let overallClients = 0;

    // For each object in the array, push into the data object.
    for (const server of json)
    {
        let strippedHostname = server.hostname.replace(/\^\d/g, ``);
        strippedHostname = strippedHostname.slice(0, 21);
        data.push({
            Name: strippedHostname,
            Players: `${ server.clientNum }/${ server.maxClients }`,
            Map: server.currentMap.alias,
            Gamemode: server.currentGameType.name,
            Game: server.game,
            connectCommand: `/connect ${ server.ip }:${ server.port }`,
        });
        overallClients += server.clientNum;
    }

    // cool custom status
    client.user.setActivity(`with ${ overallClients } players!`, { type: `PLAYING` });

    const channel = await client.channels.cache.get(channelId);
    if (!isFresh)
    {
        var message = await channel.messages.fetch(messageId).catch(() =>
        {
            sql.prepare(`DELETE FROM updatingMessages WHERE messageId = ? AND channelId = ?`).run(messageId, channelId);
        });
    }
    const messageContent = `Last Updated: <t:${ Math.floor(Date.now() / 1000) }:R>\n\`\`\`${ st.create(data) }\n\`\`\``;
    if (isFresh)
    {
        await channel.send(messageContent).then(
            (message) =>
            {
                sql.prepare(`INSERT INTO updatingMessages (guildId, channelId, messageId) VALUES (?, ?, ?)`).run(guildId, channelId, message.id);
            }
        );
        return;
    }
    if (!message) return;
    await message.edit(messageContent);
}
