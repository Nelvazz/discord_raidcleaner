const Discord = require('discord.js');
const moment = require('moment');
const bot = new Discord.Client();

module.exports = {
    name: "user-info",

    async execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

        let member = message.member;
        if(!message.mentions.users.first()) {
            const noMentionEmbed = new Discord.MessageEmbed()
                .setColor('#fe6a16')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription("Vous n'avez mentionné aucun utilisateur!")
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let noMention = await message.channel.send(noMentionEmbed).then(
                setTimeout(() => {
                    noMention.delete();
                    message.delete();
                }, 5000)
            )
            return;
        };

        if(args[1]) member = message.guild.member(message.mentions.users.first());
        let user = member.user;

        let userStatus = await user.presence.status.toUpperCase();
        if (userStatus === 'ONLINE') userStatus = 'En Ligne';
        if (userStatus === 'IDLE') userStatus = 'Inactif';
        if (userStatus === 'DND') userStatus = 'Ne Pas Déranger';
        if (userStatus === 'OFFLINE') userStatus = 'Hors Ligne';

        let userinfoEmbed = new Discord.MessageEmbed()
            .setColor("#fe6a16")
            .setThumbnail(user.displayAvatarURL({format: 'png', dynamic: 'true'}))
            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
            .setDescription(`Voici les informations de **${user.username}**`)
            .addField(`Pseudonyme :`, `${user.tag}`)
            .addField(`Créé le :`, `${moment.utc(user.createdTimestamp).format("DD/MM/YYYY | hh:mm:ss")}`)
            .addField(`A rejoint le serveur le :`, `${moment.utc(member.joinedAt).format("DD/MM/YYYY | hh:mm:ss")}`)
            .addField(`Status :`, `${userStatus}`)
            .addField(`ID :`, `${member.id}`)
            .setTimestamp()
            .setFooter(`Server ${guildName} | Bot ${botName}`)
        message.channel.send(userinfoEmbed);
    }
}