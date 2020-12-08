const Discord = require('discord.js');
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: "tempmute",

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if(message.member.hasPermission('KICK_MEMBERS')){
        let usermention = message.guild.member(message.mentions.users.first());
        let time = args[2];
        let muteRole = message.guild.roles.cache.find(r => r.name == "Muted") || message.guild.roles.cache.find(r => r.name == "Mute")

        if(!usermention) {
            const noMentionEmbed = new Discord.MessageEmbed()
                .setColor("#DE0C78")
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription("Vous n'avez mentionné aucun utilisateur !")
                .setFooter(`Server ${guildName} | Bot ${botName}`)
            let noMention = await message.channel.send(noMentionEmbed).then(
                setTimeout(() => {
                    message.delete()
                    noMention.delete()
                }, 5000)
            )
            return;
        }
        if(!usermention.id === message.author.id) {
            const muteYouEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription("Vous ne pouvez pas vous bannir !")
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let muteYou = await message.channel.send(muteYouEmbed).then(
                setTimeout(() => {
                    message.delete()
                    muteYou.delete()
                }, 5000)
            )
            return;
        };
        if(!time) {
            const noTimeEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription("Vous n'avez pas spécifié la durée !")
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let noTime = await message.channel.send(noTimeEmbed).then(
                setTimeout(() => {
                    message.delete()
                    noTime.delete()
                }, 5000)
            )
            return;
        };
        if(isNaN(time)) {
            const nanNumberEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                .setDescription(`\`${args[2]}\` n'est pas un nombre !`)
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let nanNumber = await message.channel.send(nanNumberEmbed).then(
                setTimeout(() => {
                    message.delete()
                    nanNumber.delete()
                }, 5000)
            )
            return;
        };
        if (!isNaN(time)) time = parseFloat(args[2]);
        let reason = 'Aucune raison spécifié';
        if (args[4]) reason = args.splice(4).join(" ");

        if (!args[3]) {
            const noTimeSpecEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${guildName} Bot`, bot.user.displayAvatarURL())
                .setDescription(`Vous n'avez pas spécifié le type de temps ! \n\n \`d\` : Jours\n \`h\` : Heures\n \`m\` : Minutes\n \`s\` : Secondes`)
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let noTimeSpec = await message.channel.send(noTimeSpecEmbed).then(
                setTimeout(() => {
                    message.delete()
                    noTimeSpec.delete()
                }, 10000)
            )
            return;
        }
        if (args[3] !== "d" && args[3] !== "h" && args[3] !== "m" && args[3] !== "s" ) {
            const incorrectTimeSpecEmbed = new Discord.MessageEmbed()
                .setColor('#DE0C78')
                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                .setAuthor(`${guildName} Bot`, bot.user.displayAvatarURL())
                .setDescription(`\`${args[3]}\` n'est pas un type de temps valides ! \n\n \`d\` : Jours\n \`h\` : Heures\n \`m\` : Minutes\n \`s\` : Secondes`)
                .setTimestamp()
                .setFooter(`${guildName} Server | ${botName} Bot`)
            let incorrectTimeSpec = await message.channel.send(incorrectTimeSpecEmbed).then(
                setTimeout(() => {
                    message.delete()
                    incorrectTimeSpec.delete()
                }, 10000)
            )
            return;
        }

        if(args[3] === "d") {
            var timedown = "Jour"
            var days = time;
            var millisecondsday = days * 24 * 60 * 60 * 1000;

            usermention.roles.add(muteRole)

            setTimeout(() => {
                usermention.roles.remove(muteRole)
            }, millisecondsday)
        }

        if(args[3] === "h") {
            var timedown = "Heure"
            var hours = time;
            var millisecondshours = hours * 60 * 60 * 1000;

            usermention.roles.add(muteRole)

            setTimeout(() => {
                usermention.roles.remove(muteRole)
            }, millisecondshours)
        }

        if(args[3] === "m") {
            var timedown = "Minute"
            var minutes = time;
            var millisecondsminutes = minutes * 60 * 1000;

            usermention.roles.add(muteRole)

            setTimeout(() => {
                usermention.roles.remove(muteRole)
            }, millisecondsminutes)
        }

        if(args[3] === "s") {
            var timedown = "Seconde"
            var seconds = time;
            var millisecondsseconds = seconds * 1000;

            usermention.roles.add(muteRole)

            setTimeout(() => {
                usermention.roles.remove(muteRole)
            }, millisecondsseconds)
        }

        if(time > 1) {
            var s = "s";
        } else {
            var s = "";
        }

        let tempmuteEmbed = new Discord.MessageEmbed()
            .setColor('#DE0C78')
            .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
            .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
            .setDescription(`<@${usermention.id}> a été temporairement mute. \n Temps : ${time} ${timedown}${s} \n Raison : ${reason} \n Par : ${message.author.username}`)
            .setTimestamp()
            .setFooter(`Server ${guildName} | Bot ${botName}`)
        message.guild.channels.cache.get(modLogChannel).send(tempmuteEmbed)
        message.delete()
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