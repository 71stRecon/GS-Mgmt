import { SendPacket } from "../../index.js";

export default {
    name: `update`,
    description: `Updates Game Servers.`,
    defaultMemberPermissions: [`KickMembers`],
    options: [],

    async execute(interaction)
    {
        await interaction.deferReply();

        var data = {
            header: `updateall`,
            body: ``,
        };

        await SendPacket(data);
        interaction.followUp(`Sending update request to all..`);
    }
};
