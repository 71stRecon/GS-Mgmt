const { seniorStaffID } = require(`../../config.json`);

module.exports = {
    name: `rt5`,
    aliases: [``],
    async execute(message)
    {
        const seniorStaff = message.guild.roles.cache.find((r) => r.id === seniorStaffID);
        if (!message.member.roles.cache.has(seniorStaff.id)) return;

        const { spawn } = require(`child_process`);
        const bat = spawn(`cmd.exe`, [`/c`, `C:\\Scripts\\t5m-restart.bat`]);

        bat.stdout.on(`data`, (data) =>
        {
            console.log(data.toString());
        });

        bat.stderr.on(`data`, (data) =>
        {
            console.error(data.toString());
        });

        bat.on(`exit`, (code) =>
        {
            console.log(`Child exited with code ${ code }`);
        });

        message.channel.send(`Attempted to restart T5m Servers...`);
    }
};
