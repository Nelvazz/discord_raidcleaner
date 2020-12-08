const Discord = require('discord.js');
const config = require('../storage/config.json')
const bot = new Discord.Client();

module.exports = {
    name: "tempban",

    async execute(message, args, bot) {
        const modLogChannel = config[message.guild.id]["modlogchannel"];
        const guildName = message.guild.name;
        const botName = bot.user.username;

        if (message.member.hasPermission('BAN_MEMBERS')) {
            let usermention = message.guild.member(message.mentions.users.first());
            let userdm = message.mentions.users.first();
            let time = args[2];

            if (!usermention) {
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
            if(!usermention.bannable) {
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
            if(!usermention.id === message.author.id) {
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
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
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
                    .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
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

            message.delete();

            if (time > 1) {
                var s = "s";
            } else {
                var s = "";
            }

            if (args[3] === "d") {
                var timedown = "Jour"
                var days = time;
                var millisecondsday = days * 24 * 60 * 60 * 1000;
                var memberUnban = person.id;

                if (!person.user.bot) {
                    try {
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été temporairement bannie du serveur ${guildName}. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username}`)
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );
                    } catch {
                        message.channel.send('User not dmmed, there was an error.')
                    }
                }

                let id = usermention.id;
                setTimeout(() => {
                    usermention.ban({
                        reason: reason,
                        id: id
                    });
                }, 800);

                let tempbanEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setDescription(`<@${usermention.id}> a été bannie du serveur. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username} \n Id: ${id}`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(tempbanEmbed)

                setTimeout(() => {
                    message.guild.fetchBans().then(bans => {
                        message.guild.members.unban(memberUnban)
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été débannie du serveur ${guildName}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );

                        let tempbanEndEmbed = new Discord.MessageEmbed()
                            .setColor('#DE0C78')
                            .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setDescription(`<@${usermention.id}> a été débannie du serveur ${guildName}.`)
                            .setTimestamp()
                            .setFooter(`${guildName} Server | ${botName} Bot`)
                        message.guild.channels.cache.get(modLogChannel).send(tempbanEndEmbed)
                    })
                }, millisecondsday)
            }

            if (args[3] === "h") {
                var timedown = "Heure"
                var hours = time;
                var millisecondshours = hours * 60 * 60 * 1000;
                var memberUnban = usermention.id;

                if (!usermention.user.bot) {
                    try {
                        usermentiondm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été temporairement bannie du serveur ${guildName}. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );
                    } catch {
                        message.channel.send('User not dmmed, there was an error.')
                    }
                }

                let id = usermention.id;
                setTimeout(() => {
                    usermention.ban({
                        reason: reason,
                        id: id
                    });
                }, 800);

                let tempbanEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setDescription(`<@${usermention.id}> a été bannie du serveur. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username} \n Id: ${id}`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(tempbanEmbed)

                setTimeout(() => {
                    message.guild.fetchBans().then(bans => {
                        message.guild.members.unban(memberUnban)
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été débannie du serveur ${guildName}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );

                        let tempbanEndEmbed = new Discord.MessageEmbed()
                            .setColor('#DE0C78')
                            .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setDescription(`<@${usermention.id}> a été débannie du serveur ${guildName}.`)
                            .setTimestamp()
                            .setFooter(`${guildName} Server | ${botName} Bot`)
                        message.guild.channels.cache.get(modLogChannel).send(tempbanEndEmbed)
                    })
                }, millisecondshours)
            }

            if (args[3] === "m") {
                var timedown = "Minute"
                var minutes = time;
                var millisecondsminutes = minutes * 60 * 1000;
                var memberUnban = usermention.id;

                if (!usermention.user.bot) {
                    try {
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été temporairement bannie du serveur ${guildName}. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );
                    } catch {
                        message.channel.send('User not dmmed, there was an error.')
                    }
                }

                let id = usermention.id;
                setTimeout(() => {
                    usermention.ban({
                        reason: reason,
                        id: id
                    });
                }, 800);

                let tempbanEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setDescription(`<@${usermention.id}> a été bannie du serveur. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username}  \n Id: ${id}`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(tempbanEmbed)

                setTimeout(() => {
                    message.guild.fetchBans().then(bans => {
                        message.guild.members.unban(memberUnban)
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été débannie du serveur ${guildName}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );

                        let tempbanEndEmbed = new Discord.MessageEmbed()
                            .setColor('#DE0C78')
                            .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setDescription(`<@${usermention.id}> a été débannie du serveur ${guildName}.`)
                            .setTimestamp()
                            .setFooter(`${guildName} Server | ${botName} Bot`)
                        message.guild.channels.cache.get(modLogChannel).send(tempbanEndEmbed)
                    })
                }, millisecondsminutes)
            }

            if (args[3] === "s") {
                var timedown = "Seconde"
                var seconds = time;
                var millisecondsseconds = seconds * 1000;
                var memberUnban = usermention.id;

                if (!usermention.user.bot) {
                    try {
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor("#DE0C78")
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été temporairement bannie du serveur ${guildName}. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );
                    } catch {
                        message.channel.send("Un problème est survenue !")
                    }
                }

                let id = usermention.id;
                setTimeout(() => {
                    usermention.ban({
                        reason: reason,
                        id: id
                    });
                }, 800);

                let tempbanEmbed = new Discord.MessageEmbed()
                    .setColor('#DE0C78')
                    .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                    .setDescription(`<@${usermention.id}> a été temporairement bannie du serveur. \n Raison : ${reason} \n Temps : ${time} ${timedown}${s} \n Par : ${message.author.username}  \n Id: ${id}`)
                    .setTimestamp()
                    .setFooter(`${guildName} Server | ${botName} Bot`)
                message.guild.channels.cache.get(modLogChannel).send(tempbanEmbed)

                setTimeout(() => {
                    message.guild.fetchBans().then(bans => {
                        message.guild.members.unban(memberUnban)
                        userdm.send(
                            new Discord.MessageEmbed()
                                .setColor('#DE0C78')
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
                                .setDescription(`Vous avez été débannie du serveur ${guildName}.`)
                                .setTimestamp()
                                .setFooter(`${guildName} Server | ${botName} Bot`)
                        );

                        let tempbanEndEmbed = new Discord.MessageEmbed()
                            .setColor('#DE0C78')
                            .setThumbnail(usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setAuthor(usermention.user.username, usermention.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                            .setDescription(`<@${usermention.id}> a été débannie du serveur ${guildName}.`)
                            .setTimestamp()
                            .setFooter(`${guildName} Server | ${botName} Bot`)
                        message.guild.channels.cache.get(modLogChannel).send(tempbanEndEmbed)
                    })
                }, millisecondsseconds)
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
    }
}