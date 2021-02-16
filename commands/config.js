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
    name: "config",

    async execute(message, args, bot) {
        db.query(`SELECT * FROM guild WHERE guild = ${message.guild.id}`, async (err, req) => {
            
            const guildName = message.guild.name;
            const botName = bot.user.username;
            const configuration = args[1];

            if(message.member.hasPermission('MANAGE_GUILD', 'ADMINISTRATOR')) {
                if (!configuration) {
                    const missingConfigEmbed = new Discord.MessageEmbed()
                        .setColor('#F04141')
                        .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription(`Vous n'avez renseigné aucune configuration !`)
                        .setTimestamp()
                        .setFooter(`${guildName} Server | ${botName} Bot`)
                    let missingConfig = await message.channel.send(missingConfigEmbed).then(
                        setTimeout(() => {
                            message.delete()
                            missingConfig.delete()
                        }, 5000)
                    )
                    return;
                }

                if (configuration !== "logchannel") {
                    const incorrectConfigEmbed = new Discord.MessageEmbed()
                        .setColor('#F04141')
                        .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription(`La configuration \`${configuration}\` est invalide !`)
                        .setTimestamp()
                        .setFooter(`${guildName} Server | ${botName} Bot`)
                    let incorrectConfig = await message.channel.send(incorrectConfigEmbed).then(
                        setTimeout(() => {
                            message.delete()
                            incorrectConfig.delete()
                        }, 5000)
                    )
                    return;
                }

                if (!args[2]) {
                    const missingChannelEmbed = new Discord.MessageEmbed()
                        .setColor('#F04141')
                        .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription(`Veuillez spécifier un salon grace à son ID !`)
                        .setTimestamp()
                        .setFooter(`${guildName} Server | ${botName} Bot`)
                    let missingChannel = await message.channel.send(missingChannelEmbed).then(
                        setTimeout(() => {
                            message.delete()
                            missingChannel.delete()
                        }, 5000)
                    )
                    return;
                }

                if (configuration === "logchannel") {
                    db.query(`UPDATE guild SET modlogchannel = '${args[2].replace(/<#/, "").replace(/>/, "")}' WHERE guild = ${message.guild.id}`)

                    if (message.guild.channels.cache.filter(channel => channel.id === args[2].replace(/<#/, "").replace(/>/, "")) === false) {
                        const invalidChannelEmbed = new Discord.MessageEmbed()
                            .setColor("#F04141")
                            .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                            .setDescription(`\`${args[2]}\` n'est pas un salon valide !`)
                            .setTimestamp()
                            .setFooter(`Server ${guildName} | Bot ${botName}`)
                        let invalidChannel = await message.channel.send(invalidChannelEmbed).then(
                            setTimeout(() => {
                                message.delete()
                                invalidChannel.delete()
                            }, 5000)
                        )
                        return;
                    }

                    const newLogChannelEmbed = new Discord.MessageEmbed()
                        .setColor('#F04141')
                        .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/807675204083122176/data-copy.png')
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription(`Le salon des logs à bien été configurés sur <#${args[2].replace(/<#/, "").replace(/>/, "")}> !`)
                        .setTimestamp()
                        .setFooter(`${guildName} Server | ${botName} Bot`)
                    let newLogChannelDelete = await message.channel.send(newLogChannelEmbed).then(
                        setTimeout(() => {
                            message.delete()
                            newLogChannelDelete.delete()
                        }, 30000)
                    )

                    const newChannelMessageEmbed = new Discord.MessageEmbed()
                        .setColor('#F04141')
                        .setThumbnail(bot.user.displayAvatarURL())
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription(`C'est ici que vont désormais êtres envoyés les messages de logs !`)
                        .setTimestamp()
                        .setFooter(`${guildName} Server | ${botName} Bot`)
                    let newChannelMessageDelete = await message.guild.channels.cache.get(args[2].replace(/<#/, "").replace(/>/, "")).send(newChannelMessageEmbed).then(
                        setTimeout(() => {
                            newChannelMessageDelete.delete()
                        }, 30000)
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
                return;
            }

            
        })
    }
}