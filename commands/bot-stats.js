const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const config = require('../storage/config.json')
const default_verifBot = config.default_verifBot;
const default_prefix = config.default_prefix;
const mysql = require('mysql');

const db = new mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "guilddb"
});

module.exports = {
    name: "bot-stats",

    async execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

        let totalSeconds = (bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `\`${days}\` jours, \`${hours}\` heures, \`${minutes}\` minutes et \`${seconds}\` secondes`;

        const info = new Discord.MessageEmbed()
            .setColor('#fe6a16')
            .setThumbnail(bot.user.displayAvatarURL())
            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
            .setDescription(`\n**Serveurs :** \nJe suis présent sur \`${bot.guilds.cache.size}\` serveurs. \n\n**Utilisateurs :** \nJe compte \`${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\` utilisateurs.\n\n**Mémoire :** \n \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}\` MB\n\n**En ligne :**\nDepuis ${uptime}\n\n [Serveur Support](https://discord.gg/eSrpZQRWFT) | [Vote](https://discordbotlist.com/bots/raidcleaner)`)
            .setTimestamp()
            .setFooter(`Server ${guildName} | Bot ${botName}`)
        message.channel.send(info)
    }
}