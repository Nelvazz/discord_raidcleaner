const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
    name: "ping",

    execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

        var pingingEmbed = new Discord.MessageEmbed()
            .setColor("#fe6a16")
            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
            .setDescription(`Recherche du ping...`)
            .setTimestamp()
            .setFooter(`Server ${guildName} | Bot ${botName}`)
        message.channel.send(pingingEmbed).then(m =>{

            var ping = m.createdTimestamp - message.createdTimestamp;

            var embed = new Discord.MessageEmbed()
                .setColor("#fe6a16")
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/784479375554117652/network.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription(`Le bot est à ${ping} de ping.`)
                .setTimestamp()
                .setFooter(`Server ${guildName} | Bot ${botName}`)
            m.edit(embed).then(m => {
                setTimeout(() => {
                    m.delete()
                    message.delete()
                }, 10000)
            })
        });
    }
}