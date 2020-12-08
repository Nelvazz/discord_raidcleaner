const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
    name: "clean",

    async execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

            if(message.member.hasPermission('ADMINSTRATOR', 'MANAGE_CHANNELS')) {
                if (!args[1]) {
                    const missingnameEmbed = new Discord.MessageEmbed()
                        .setColor("#F04141")
                        .setThumbnail(bot.user.displayAvatarURL())
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription("Vous n'avez spécifié aucun nom de channel !")
                        .setTimestamp()
                        .setFooter(`Server ${guildName} | Bot ${botName}`)
                    let missingname = await message.channel.send(missingnameEmbed).then(
                        setTimeout(() => {
                            message.delete()
                            missingname.delete()
                        }, 5000)
                    )
                    return;
                }
                        // Vérifie si le channel existe//
                                // Marche pas //
                if (message.guild.channels.cache.filter(channel => channel.name === args[1]) == null) {
                    if (!args[1]) {
                        const missingnameEmbed = new Discord.MessageEmbed()
                            .setColor("#F04141")
                            .setThumbnail(bot.user.displayAvatarURL())
                            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                            .setDescription("Aucun channel ne possède ce nom !")
                            .setTimestamp()
                            .setFooter(`Server ${guildName} | Bot ${botName}`)
                        let missingname = await message.channel.send(missingnameEmbed).then(
                            setTimeout(() => {
                                message.delete()
                                missingname.delete()
                            }, 5000)
                        )
                        return;
                    }
                }
    
                message.guild.channels.cache.filter(channel => channel.name === args[1]).each(channel => channel.delete())
                const cleanRaidEmbed = new Discord.MessageEmbed()
                    .setColor("#F04141")
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Tous les salons ayant pour nom : \`${args[1]}\` ont été supprimés avec succès !`)
                    .setTimestamp()
                    .setFooter(`Server ${guildName} | Bot ${botName}`)
                let cleanRaid = await message.channel.send(cleanRaidEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        cleanRaid.delete()
                    }, 5000)
                )
            } else {
                const unauthorizedEmbed = new Discord.MessageEmbed()
                    .setColor("#F04141")
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Vous n'avez pas la permissions d'éxécturer cette commande !`)
                    .setTimestamp()
                    .setFooter(`Server ${guildName} | Bot ${botName}`)
                let unauthorized = await message.channel.send(unauthorizedEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        unauthorized.delete()
                    }, 5000)
                )
            }
    }
}