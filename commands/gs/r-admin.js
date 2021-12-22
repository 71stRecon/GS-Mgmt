const puppeteer = require(`puppeteer`);
const { seniorStaffID } = require(`../../config.json`);

module.exports = {
    name: `radmin`,
    aliases: [``],
    async execute(message)
    {
        const seniorStaff = message.guild.roles.cache.find((r) => r.id === seniorStaffID);
        if (!message.member.roles.cache.has(seniorStaff.id)) return;

        try
        {
            // Use Puppeteer to open a new browser window (127.0.0.1:1624/Console)
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`http://127.0.0.1:1624/Console`);
            await page.type(`#console_command_value`, `!restart`);
            await page.keyboard.press(`Enter`);
            await browser.close();
            message.channel.send(`Attempted to restart IW4MAdmin...`);
        }
        catch (err)
        {
            console.log(err);
        }
    }
};
