const Discord = require('discord.js');
const fs = require('fs');
const config = require('../storage/config.json')
const bdd = require('../storage/warn.json');
const bot = new Discord.Client();

module.exports = {
    name: "warn",

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if(message.member.hasPermission('KICK_MEMBERS')) {
            const userMention = message.mentions.users.first();

            if (!userMention) {
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
            const userMentionUsername = userMention.username;
            const userMentionID = userMention.id;
            
            let reason = 'Aucune raison spécifié';
            if(args[2]) reason = args.splice(2).join(" ");

            if(!bdd["warn"][userMentionUsername] && !bdd["reason"][userMentionUsername]) {
                bdd["warn"][userMentionUsername] = 1
                bdd["reason"][userMentionUsername] = {"Premier Warn": reason}
                Savebdd();

                message.delete();
                const firstWarnEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail(userMention.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                    .setAuthor(userMention.username, userMention.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                    .setDescription(`<@${userMentionID}> a maintenant 1 avertissement. \n Raison : ${reason} \n Par : ${message.author.username}`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(firstWarnEmbed);
            } else {
                if(bdd["warn"][userMentionUsername] == 1) {
                    bdd["warn"][userMentionUsername]++
                    bdd["reason"][userMentionUsername]["Deuxième Warn"] = reason
                    Savebdd();

                    message.delete();
                    const secondWarnEmbed = new Discord.MessageEmbed()
                        .setColor('#DE0C78')
                        .setThumbnail(userMention.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                        .setAuthor(userMention.username, userMention.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                        .setDescription(`<@${userMentionID}> a maintenant 2 avertissements. \n Raison : ${reason} \n Par : ${message.author.username}`)
                        .setTimestamp()
                        .setFooter(`${guildName} Server | ${botName} Bot`)
                    message.guild.channels.cache.get(modLogChannel).send(secondWarnEmbed);
                } else {
                    if(bdd["warn"][userMentionUsername] == 2) {
                        bdd["warn"][userMentionUsername]++
                        bdd["reason"][userMentionUsername]["Troisième Warn"] = reason
                        Savebdd();

                        message.delete();
                        const thirdWarnEmbed = new Discord.MessageEmbed()
                            .setColor('#DE0C78')
                            .setThumbnail(userMention.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                            .setAuthor(userMention.username, userMention.displayAvatarURL({ format: 'png', dynamic: 'true' }))
                            .setDescription(`<@${userMentionID}> a maintenant 3 avertissements. \n Raison : ${reason} \n Par : ${message.author.username}`)
                            .setTimestamp()
                            .setFooter(`${guildName} Server | ${botName} Bot`)
                        message.guild.channels.cache.get(modLogChannel).send(thirdWarnEmbed);
                    } else {
                        if(bdd["warn"][userMentionUsername] == 3) {
                            const maxWarnEmbed = new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail('https://cdn.discordapp.com/attachments/783617098780901397/783617380696719370/warning.png')
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Cet utilisateur a atteint son nombre maximum de warn !`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                            let maxWarn = await message.channel.send(maxWarnEmbed).then(
                                setTimeout(() => {
                                    message.delete()
                                    maxWarn.delete()
                                }, 10000)
                            )
                        }
                    }
                }
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
            fs.writeFile("./storage/warn.json", JSON.stringify(bdd, null, 4), (err) => {
                if (err) message.channel.send("Une erreur est survenue !");
            });
        }
        Savebdd();

    }
}