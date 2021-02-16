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
    name: "bot-info",

    async execute(message, args, bot) {
        db.query(`SELECT * FROM guild WHERE guild = ${message.guild.id}`, async (err, req) => {
            let prefix = req[0].prefix;
            if (prefix === "undefined") prefix = default_prefix;

            let verifbot = await req[0].botverification;
            if (verifbot === undefined) verifbot = default_verifBot;

            if (default_verifBot === true) default_verifBottxt = 'Activé';
            if (default_verifBot === false) default_verifBottxt = 'Désactivé';
            if (verifbot === "true") verifbot = 'Activé';
            if (verifbot === "false") verifbot = 'Désactivé';

            const guildName = message.guild.name;
            const botName = bot.user.username;

            const info = new Discord.MessageEmbed()
                .setColor('#fe6a16')
                .setThumbnail(bot.user.displayAvatarURL())
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription(`\n**Pseudonyme :** \n\`${bot.user.tag}\` \n\n**Description :** \n\`${bot.user.tag} est un bot qui permet de protéger vos serveurs de potentiels Raids.\` \n\n**Préfix de base :** \n\`${default_prefix}\` \n\n**Préfix du serveur :** \n\`${prefix}\` \n\n**Vérification de base :** \n\`${default_verifBottxt}\` \n\n**Vérification du serveur :** \n\`${verifbot}\` \n\n**Développeur :** \n\`Nelvazz#6862\` \n\n [Serveur Support](https://discord.gg/eSrpZQRWFT) | [Vote](https://discordbotlist.com/bots/raidcleaner)`)
                .setTimestamp()
                .setFooter(`Server ${guildName} | Bot ${botName}`)
            message.channel.send(info)
        })
        
    }
}