const Discord = require('discord.js');
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: "ban",

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if (message.member.hasPermission('BAN_MEMBERS')) {
            const userMention = message.guild.member(message.mentions.users.first())
            const userDM = message.mentions.users.first();

            if (!userMention) {
                const nomentionEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous n'avez mentionné aucun utilisateur !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let nomention = await message.channel.send(nomentionEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        nomention.delete()
                    }, 5000)
                )
                return;
            };
            if(!userMention.bannable) {
                const nobannableEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous ne pouvez pas bannir cet utilisateur !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let nobannable = await message.channel.send(nobannableEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        nobannable.delete()
                    }, 5000)
                )
                return;
            };
            if(!userMention.id === message.author.id) {
                const banyouEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous ne pouvez pas vous bannir !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let banyou = await message.channel.send(banyouEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        banyou.delete()
                    }, 5000)
                )
                return;
            };
            let reason = 'Aucune raison spécifié.';
            if(args[2]) reason = args.splice(2).join(" ");

            if (!userMention.user.bot) {
                try {
                    userDM.send(
                        new Discord.MessageEmbed()
                            .setColor('#DE0C78')
                            .setThumbnail(bot.user.displayAvatarURL())
                            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                            .setDescription(`Vous avez été bannie du serveur ${guildName}. \n Raison: ${reason} \n Par : ${message.author.username}`)
                            .setTimestamp()
                            .setFooter(`${guildName} Server | ${botName} Bot`)
                    )
                } catch {
                    message.channel.send("L'utilisateur n'a pas pu être DM.")
                }
            }

            let id = userMention.id;
            setTimeout(() => {
                userMention.ban({
                    reason: reason,
                    id: id
                });
            }, 1000);

            message.delete()
            const banEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail(userMention.user.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                .setAuthor(userMention.user.username, userMention.user.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                .setDescription(`**${userMention.user.username}** à été bannie du serveur. \n Raison : ${reason} \n Par : ${message.author.username} \n ID : ${userMention.id}`)
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            message.guild.channels.cache.get(modLogChannel).send(banEmbed);
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