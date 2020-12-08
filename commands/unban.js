const Discord = require('discord.js');
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: "unban",

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if(message.member.hasPermission('BAN_MEMBERS')) {
            const userID = args[1];

            if (!userID) {
                const noIdEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous n'avez spécifié aucune ID !")
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                let noId = await message.channel.send(noIdEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        noId.delete()
                    }, 5000)
                )
            } else {
                try {
                    message.guild.fetchBans().then(async function(bans) {
                        if(bans.size == 0) {
                            const nobanEmbed = new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription("Cet utilisateur n'est pas bannie !")
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                            let noban = await message.channel.send(nobanEmbed).then(
                                setTimeout(() => {
                                    message.delete()
                                    noban.delete()
                                }, 5000)
                            )
                        } else {
                            message.delete();
                            message.guild.members.unban(userID)
                            let unbanEmbed = new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.users.cache.get(userID).displayAvatarURL())
                                .setAuthor(bot.users.cache.get(userID).username, bot.users.cache.get(userID).displayAvatarURL())
                                .setDescription(`<@${userID}> a été débannie du serveur. \n Par : ${message.author.username}`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                            message.guild.channels.cache.get(modLogChannel).send(unbanEmbed)
                        };
                    })
                } catch (e) {
                    return console.log(`%c ${error}`, 'color: red')
                }
            }
        } else {
            const unauthorizedEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail(bot.user.displayAvatarURL())
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