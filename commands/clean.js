const Discord = require('discord.js');
const { createPool } = require('mysql');
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
                        .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription("Vous n'avez spécifié aucun nom de salon !")
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


                var channelType;
                const arguments = args.splice(1).join(" ");
                var channelArgsTypeVoice;
                var channelArgsTypeText;

                const getVoiceChannel = message.guild.channels.cache.filter(channel => channel.type === "voice").forEach(voiceName => {
                    var voiceChannel = voiceName.name;
                    // console.log(`${voiceChannel} = ${voiceChannel === arguments}`)

                    if (voiceChannel === arguments) {
                        channelArgsTypeVoice = true;
                        channelType = "vocaux"
                    } else {
                        channelArgsTypeVoice = false;
                    }
                })

                const getTextChannel = message.guild.channels.cache.filter(channel => channel.type === "text").forEach(textName => {
                    var textChannel = textName.name;
                    // console.log(`${textChannel} = ${textChannel === arguments}`)

                    if (textChannel === arguments) {
                        channelArgsTypeText = true;
                        channelType = "textuels"
                    } else {
                        channelArgsTypeText = false;
                    }
                })

                // console.log(channelType)
                // console.log(channelArgsTypeVoice)
                // console.log(channelArgsTypeText)

                if (channelArgsTypeVoice === false && channelArgsTypeText === false) {
                    const missingnameEmbed = new Discord.MessageEmbed()
                        .setColor("#F04141")
                        .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                        .setDescription("Aucun salon ne possède ce nom !")
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

                
                if (channelArgsTypeText === true && channelArgsTypeVoice === false) channelType = "textuels";
                if (channelArgsTypeText === false && channelArgsTypeVoice === true) channelType = "vocaux";
                if (channelArgsTypeVoice === true && channelArgsTypeText === true) channelType = "vocaux et textuels";
                // console.log(channelType)

                message.guild.channels.cache.filter(channel => channel.name === arguments).each(channel => channel.delete())
                const cleanRaidEmbed = new Discord.MessageEmbed()
                    .setColor("#F04141")
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`Tous les salons ${channelType} ayant pour nom : \`${arguments}\` ont été supprimés avec succès !`)
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
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
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