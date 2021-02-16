const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
    name: "clear",

    async execute(message, args, bot) {
        const guildname = message.guild.name;
        const botname = bot.user.username;

        if (message.member.hasPermission('MANAGES_MESSAGES')) {
            if (!args[1]) {
                const noNumberEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botname} Bot`, bot.user.displayAvatarURL())
                    .setDescription("Vous n'avez spécifié aucun nombre !")
                    .setTimestamp()
                    .setFooter(`${guildname} Server | ${botname} Bot`)
                let noNumber = await message.channel.send(noNumberEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        noNumber.delete()
                    }, 5000)
                )
                return;
            }
            if (isNaN(args[1])) {
                const nanNumberEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                    .setAuthor(`${botname} Bot`, bot.user.displayAvatarURL())
                    .setDescription(`${args[1]} n'est pas un nombre !`)
                    .setTimestamp()
                    .setFooter(`${guildname} Server | ${botname} Bot`)
                let nanNumber = await message.channel.send(nanNumberEmbed).then(
                    setTimeout(() => {
                        message.delete()
                        nanNumber.delete()
                    }, 5000)
                )
                return;
            }
            message.delete()
            message.channel.bulkDelete(args[1])
            
            const successClearEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail(bot.user.displayAvatarURL())
                .setAuthor(`${botname} Bot`, bot.user.displayAvatarURL())
                .setDescription(`J'ai supprimé \`${args[1]}\` messages.`)
                .setTimestamp()
                .setFooter(`${guildname} Server | ${botname} Bot`)
            let successClear = await message.channel.send(successClearEmbed).then(
                setTimeout(() => {
                    successClear.delete()
                }, 5000)
            )
        } else {
            const unauthorizedEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botname} Bot`, bot.user.displayAvatarURL())
                .setDescription(`Vous n'avez pas la permissions d'éxécturer cette commande !`)
                .setTimestamp()
                .setFooter(`${guildname} Server | ${botname} Bot`)
            let unauthorized = await message.channel.send(unauthorizedEmbed).then(
                setTimeout(() => {
                    message.delete()
                    unauthorized.delete()
                }, 5000)
            )
        }
    }
}