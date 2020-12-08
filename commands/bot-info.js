const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const config = require('../storage/config.json')
const default_verifBot = config.default_verifBot;
const default_prefix = config.default_prefix;

module.exports = {
    name: "bot-info",

    async execute(message, args, bot) {
        let prefix = await config[message.guild.id]["prefix"]
        if (prefix === undefined) prefix = default_prefix;
        let verifbot = await config[message.guild.id]["verifbot"]
        if (verifbot === undefined) verifbot = default_verifBot;
        if (default_verifBot === true) default_verifBottxt = 'Activé';
        if (default_verifBot === false) default_verifBottxt = 'Désactivé';
        if (verifbot === true) verifbot = 'Activé';
        if (verifbot === false) verifbot = 'Désactivé';

        const guildName = message.guild.name;
        const botName = bot.user.username;

        const info = new Discord.MessageEmbed()
            .setColor('#fe6a16')
            .setThumbnail(bot.user.displayAvatarURL())
            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
            .setDescription(`\n**Pseudonyme :** \n\`${bot.user.tag}\` \n\n **Description :** \n\`${bot.user.tag} est un bot qui permet de protéger vos serveurs de potentiels Raids.\` \n\n **Préfix de base :** \n\`${default_prefix}\` \n\n **Préfix du serveur :** \n\`${prefix}\` \n\n **Vérification de base :** \n\`${default_verifBottxt}\` \n\n **Vérification du serveur :** \n\`${verifbot}\` \n\n **Développeur :** \n\`Nelvazz#6862\``)
            .setTimestamp()
            .setFooter(`Server ${guildName} | Bot ${botName}`)
        message.channel.send(info)

        function Savebdd() {
            fs.writeFile('./storage/config.json', JSON.stringify(config, null, 4), (err) => {
                if (err) message.channel.send("Une erreur est survenue !");
            });
        }
        Savebdd();
    }
}