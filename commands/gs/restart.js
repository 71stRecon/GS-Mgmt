/* eslint-disable no-restricted-syntax */
import * as puppeteer from "puppeteer";
import { spawn } from "node:child_process";
import { ApplicationCommandOptionType } from "discord.js";

export default {
    name: `restartgs`,
    description: `Restarts various Game Servers.`,
    defaultMemberPermissions: [`KickMembers`],
    options: [
        {
            name: `iw4x`,
            description: `Restarts IW4x Servers.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: `t5`,
            description: `Restarts T5 Servers.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: `pluto`,
            description: `Restarts Plutonium Servers.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: `iw6x`,
            description: `Restarts IW6x Servers.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: `all`,
            description: `Restarts All Game Servers.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: `iw4madmin`,
            description: `Restarts IW4MAdmin.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: `sparker`,
            description: `Restarts Sparkers Discord Bot.`,
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],

    async execute(interaction)
    {
        await interaction.deferReply();

        switch (interaction.options.getSubcommand())
        {
            case `iw4x`: {
                const bat = spawn(`cmd.exe`, [`/c`, `C:\\Scripts\\iw4x-restart.bat`]);

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

                interaction.followUp(`Attempted to restart IW4x Servers...`);
                break;
            }
            case `t5`: {
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

                interaction.followUp(`Attempted to restart T5m Servers...`);
                break;
            }
            case `pluto`: {
                const bat = spawn(`cmd.exe`, [`/c`, `C:\\Scripts\\pluto-restart.bat`]);

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

                interaction.followUp(`Attempted to restart Plutonium Servers...`);
                break;
            }
            case `iw6x`: {
                const bat = spawn(`cmd.exe`, [`/c`, `C:\\Scripts\\iw6x-restart.bat`]);

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

                interaction.followUp(`Attempted to restart IW6x Servers...`);
                break;
            }
            case `all`: {
                const bat = spawn(`cmd.exe`, [`/c`, `C:\\Scripts\\restart-all.bat`]);

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

                interaction.followUp(`Attempted to restart all Game Servers...`);
                break;
            }
            case `iw4madmin`: {
                try
                {
                    // Use Puppeteer to open a new browser window (127.0.0.1:1624/Console)
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto(`http://127.0.0.1:1624/Console`);
                    await page.type(`#console_command_value`, `!restart`);
                    await page.keyboard.press(`Enter`);
                    await browser.close();
                    interaction.followUp(`Attempted to restart IW4MAdmin...`);
                }
                catch (error)
                {
                    console.log(error);
                    interaction.followUp(`Failed to restart IW4MAdmin...`);
                }
                break;
            }
            case `sparker`: {
                const bat = spawn(`cmd.exe`, [`/c`, `C:\\Scripts\\iw4ma-sparker-restart.bat`]);

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

                interaction.followUp(`Attempted to restart Sparker's Discord IW4MAdmin Integration...`);
                break;
            }
        }
    }
};
