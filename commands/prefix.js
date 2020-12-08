const Discord = require('discord.js');
const fs = require('fs');
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: "prefix",

    async execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if(message.member.hasPermission('ADMINISTRATOR')) {
            const guildId = message.guild.id;
            const newprefix = args[1];
            
            if (!newprefix) {
                const noPrefixEmbed = new Discord.MessageEmbed()
                    .setColor('#fe6a16')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous n'avez renseigné aucun préfix !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let noPrefix = await message.channel.send(noPrefixEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        noPrefix.delete()
                    }, 5000)
                )
            } else {
                const acceptPrefixEmbed = new Discord.MessageEmbed()
                    .setColor('#fe6a16')
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Le nouveau préfix du serveur est : \`${newprefix}\` !`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let acceptPrefix = await message.channel.send(acceptPrefixEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        acceptPrefix.delete()
                    }, 10000)
                )
                config[guildId]["prefix"] = newprefix;
                Savebdd();
            }
        } else {
            const unauthorizedEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
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

        function Savebdd() {
            fs.writeFile("./storage/config.json", JSON.stringify(config, null, 4), (err) => {
                if (err) message.channel.send("Une erreur est survenue !");
            });
        }
        Savebdd();
    }
}