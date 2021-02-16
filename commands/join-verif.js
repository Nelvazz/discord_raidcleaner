const Discord = require('discord.js');
const fs = require('fs');
const config = require('../storage/config.json')
const bot = new Discord.Client();
const mysql = require('mysql');

const db = new mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "guilddb"
});

module.exports = {
    name: "join-verif",

    async execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if (message.member.hasPermission('MANAGE_GUILD ')) {
            const guildId = message.guild.id;
            const verifVal = args[1];
            message.delete();
            
            if (!verifVal) {
                const missingConfigEmbedEmbed = new Discord.MessageEmbed()
                    .setColor('#F04141')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous n'avez renseigné aucune configuration !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let missingConfigEmbed = await message.channel.send(missingConfigEmbedEmbed).then(
                    setTimeout(() => {
                        missingConfigEmbed.delete()
                    }, 5000)
                )
                return;
            }
            if (verifVal !== "on" && verifVal !== "off") {
                const incorrectConfigEmbed = new Discord.MessageEmbed()
                    .setColor('#F04141')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`La configuration \`${verifVal}\` est invalide !`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let incorrectConfig = await message.channel.send(incorrectConfigEmbed).then(
                    setTimeout(() => {
                        incorrectConfig.delete()
                    }, 5000)
                )
                return;
            }
        
            if (verifVal === "on") {
                db.query(`UPDATE guild SET botverification = '${true}' WHERE guild = ${message.guild.id}`)

                const filter = m => args[0] && m.author.id === message.author.id;
                const collector = message.channel.createMessageCollector(filter, { time: 15000 });
            
                const channelSetEmbed = new Discord.MessageEmbed()
                    .setColor('#F04141')
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Le système de vérification est désormais configurer sur \`${verifVal}\`.\n\nVeuillez envoyer l'ID du salon où vous voulez que les vérifications soient envoyées.`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let channelSet = await message.channel.send(channelSetEmbed).then(
                    collector.on('collect', async function (m) {
                        if (message.guild.channels.cache.get(m.content.replace(/<#/, "").replace(/>/, ""))) {
                            db.query(`UPDATE guild SET botverificationchannel = '${m.content.replace(/<#/, "").replace(/>/, "")}' WHERE guild = ${message.guild.id}`)

                            channelSet.delete();
                            m.delete()
                            const channelConfEmbed = new Discord.MessageEmbed()
                                .setColor('#F04141')
                                .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/807675204083122176/data-copy.png')
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Le salon où vont être envoyées les vérifications est ${message.guild.channels.cache.get(`${m}`)}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                            let channelConf = await message.channel.send(channelConfEmbed).then(
                                setTimeout(() => {
                                    channelConf.delete()
                                }, 10000)
                            )
                            collector.stop()
                        } else {
                            message.channel.send("Ce salon n'existe pas !")
                            collector.stop()
                        }
                    	console.log(`Collected ${m.content}`);
                    })
                    
                )
            }
            if (verifVal === "off") {
                db.query(`UPDATE guild SET botverification = '${false}' WHERE guild = ${message.guild.id}`)

                const configValEmbed = new Discord.MessageEmbed()
                    .setColor('#F04141')
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Le système de vérification est désormais configurer sur \`${verifVal}\`.`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let configVal = await message.channel.send(configValEmbed).then(
                    setTimeout(() => {
                        configVal.delete()
                    }, 10000)
                )
            }
        } else {
            const unauthorizedEmbed = new Discord.MessageEmbed()
                .setColor('#F04141')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription(`Vous n'avez pas la permissions d'éxécturer cette commande !`)
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let unauthorized = await message.channel.send(unauthorizedEmbed).then(
                setTimeout(() => {
                    message.delete()
                    unauthorized.delete()
                }, 5000)
            )
        }
    }
}