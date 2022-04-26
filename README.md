<div align="center">
<h1><a href="https://71strecon.net/discord">71st Recon Management Bot</a><br>
<a href="#"><img alt="Will provide support?" src="https://img.shields.io/maintenance/no/2022?label=Will%20provide%20support%3F"></a>
<a href="https://github.com/71stRecon/GS-Mgmt"><img alt="GitHub license" src="https://img.shields.io/github/license/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/actions/workflows/linter.yml"><img alt="GitHub Actions Status" src="https://github.com/71stRecon/GS-Mgmt/actions/workflows/linter.yml/badge.svg"></a>
</h1></div>

# Table of Contents <!-- omit in toc -->
- [Screenshots](#screenshots)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Setup](#setup)

## Screenshots

<details>
  <summary>Screenshots</summary>
  
* `/statsmsg`
  * ![img](https://i.imgur.com/B6QzZcf.png)
* `/restartgs`
  * ![img](https://i.imgur.com/LLCtday.png)

</details>

## Installation  

### Requirements  
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) >= v16.14.0
- [pm2](https://www.npmjs.com/package/pm2) (`npm i -g pm2`)

### Setup  
1. Create a new [Discord Bot](https://discord.com/developers/applications).
2. Make it a Bot account.
3. Enable all Privileged Gateway Intents.
4. `git clone https://github.com/71stRecon/GS-Mgmt.git`
5. `cd GS-Mgmt`
6. `npm i`
7. For the initial setup, use `npm start`. After initial setup is completed you can use `pm2 start npm --name "gs-bot" -- start` to keep the bot running.
8. Invite the bot to your server. (Link will be in the console after the bot is setup.)
