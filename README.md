<div align="center">
<h1><a href="https://71strecon.net/discord">71st Recon Management Bot</a><br>
<a href="https://github.com/71stRecon/GS-Mgmt"><img alt="GitHub license" src="https://img.shields.io/github/license/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/71stRecon/GS-Mgmt"></a>
<a href="https://github.com/71stRecon/GS-Mgmt/actions/workflows/linter.yml"><img alt="GitHub Actions Status" src="https://github.com/71stRecon/GS-Mgmt/actions/workflows/linter.yml/badge.svg"></a>
</h1></div>

# Table of Contents <!-- omit in toc -->
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Setup](#setup)

## Installation  

### Requirements  
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) >= v16.6.0
- [pm2](https://www.npmjs.com/package/pm2) (`npm i -g pm2`)

### Setup  
1. Create a new [Discord Bot](https://discord.com/developers/applications).
2. Make it a Bot account.
3. Enable all Privileged Gateway Intents.
4. `git clone https://github.com/71stRecon/GS-Mgmt.git`
5. `cd GS-Mgmt`
6. `npm i`
7. Copy the example config into the expected file name:
```bash
# Unix
cp config.json.example config.json
```
```batch
:: Windows
copy config.json.example config.json
```
8. Edit `config.json` with the configuration.
9. Invite the Bot to your Server.
10. `npm start` (or `pm2 start npm --name "bot" -- start`)
