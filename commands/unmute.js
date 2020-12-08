const Discord = require('discord.js');
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: "unmute",

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if(message.member.hasPermission('KICK_MEMBERS')) {
            let userMention = message.guild.member(message.mentions.users.first());
            let muteRole = message.guild.roles.cache.find(r => r.name == "Muted").id;

            if (!userMention) {
                const noMentionEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous n'avez mentionné aucun utilisateur !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let noMention = await message.channel.send(noMentionEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        noMention.delete()
                    }, 5000)
                )
                return;
            }
            if(!userMention.roles.cache.get(muteRole)) {
                const noMuteEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Cet utilisateur n'est pas mute !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let noMute = await message.channel.send(noMuteEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        noMute.delete()
                    }, 5000)
                )
                return;
            }
            const unMuteEmbed = new Discord.MessageEmbed()
                .setColor("#DE0C78")
                .setThumbnail(userMention.user.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                .setAuthor(userMention.user.username, userMention.user.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                .setDescription(`<@${userMention.id}> a été unmute ! \n Par : ${message.author.username}`)
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            message.guild.channels.cache.get(modLogChannel).send(unMuteEmbed);
            message.delete();
            userMention.roles.remove(muteRole);
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
    }
}