const Discord = require('discord.js');
const fs = require('fs')
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: 'server-locked',

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const botName = bot.user.username;
        const guildName = message.guild.name;

        if(message.member.hasPermission('MANAGE_GUILD')) {
            const configuration = args[1];

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
            if (configuration !== "on" && configuration !== "off") {
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
            if (configuration === "on") {
                config[message.guild.id]["serverlocked"] = true;
                Savebdd()

                const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
                channels.forEach(channel => {
                    channel.updateOverwrite(message.guild.roles.everyone, {
                        SEND_MESSAGES: false
                    }).then(() => {
                        channel.setName(channel.name += `🔒`)
                    })
                })
                const lockedEmbed = new Discord.MessageEmbed()
                    .setColor('#F04141')
                    .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/784907376914464828/locked.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Le serveur est maintenant confiné !`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(lockedEmbed)
            }

            if (configuration === "off") {
                config[message.guild.id]["serverlocked"] = false;

                const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');
                channels.forEach(channel => {
                    channel.updateOverwrite(message.guild.roles.everyone, {
                        SEND_MESSAGES: true
                    }).then(() => {
                            channel.setName(channel.name.replace('🔒', ''))
                        }
                    )
                })
                const unlockedEmbed = new Discord.MessageEmbed()
                    .setColor('#F04141')
                    .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/784907380855930950/unlocked.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Le serveur est maintenant déconfiné !`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(unlockedEmbed)
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

        function Savebdd() {
            fs.writeFile('./storage/config.json', JSON.stringify(config, null, 4), (err) => {
                if (err) message.channel.send("Une erreur est survenue !");
            });
        }
        Savebdd();
    }
}