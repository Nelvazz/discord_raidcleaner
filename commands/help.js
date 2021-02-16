const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('../storage/config.json');

const mysql = require('mysql');

const db = new mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "guilddb"
});

module.exports = {
    name: "help",

    async execute(message, args, bot) {
        db.query(`SELECT * FROM guild WHERE guild = ${message.guild.id}`, async (err, req) => {
            const guildName = message.guild.name;
            const botName = bot.user.username;
            const default_prefix = config.default_prefix;
            let serverPrefix = req[0].prefix;
            if (serverPrefix === "undefined") serverPrefix = default_prefix;

            const embeds = [
                // Raid Cleaner Page //
            {
                color: 'F04141',
                author: {
                    name: `${botName} Bot`,
                    icon_url: bot.user.displayAvatarURL()
                },
                description: 'Voici les commandes de la catégorie **Raid Cleaner** :',
                fields: [
                    {
                        name: `${serverPrefix}clean`,
                        value: `__Usage :__ \`${serverPrefix}clean #channel-name\`\n__Description :__ \`Vous permet de supprimer une grande quantité de salon après un raid.\``
                    },
                    {
                        name: `${serverPrefix}server-locked`,
                        value: `__Usage :__ \`${serverPrefix}server-locked off | on\`\n__Description :__ \`Vous permet de bloquer les accès externes permettant de rejoindre votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}join-verif`,
                        value: `__Usage :__ \`${serverPrefix}join-verif off | on [second-message] #channel-name\`\n__Description :__ \`Vous permet d'activer ou de désactiver le système de vérifications pour les bots externes au serveur.\``
                    },
                    {
                        name: `${serverPrefix}config`,
                        value: `__Usage :__ \`${serverPrefix}config logchannel #channel-name\`\n__Description :__ \`Vous permet de modifier certaines configurations de votre serveur.\``
                    }
                ],
                timestamp: new Date(),
                footer: `Server ${guildName} | Bot ${botName}`
            },
                // Moderation Page //
            {
                color: 'DE0C78',
                author: {
                    name: `${botName} Bot`,
                    icon_url: bot.user.displayAvatarURL()
                },
                description: 'Voici les commandes de la catégorie **Modération** :',
                fields: [
                    {
                        name: `${serverPrefix}warn`,
                        value: `__Usage :__ \`${serverPrefix}warn @User raison\`\n__Description :__ \`Vous permet d'avertir un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}mute`,
                        value: `__Usage :__ \`${serverPrefix}mute @User\`\n__Description :__ \`Vous permet de mute un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}tempmute`,
                        value: `__Usage :__ \`${serverPrefix}tempmute @User\`\n__Description :__ \`Vous permet de mute temporairement un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}unmute`,
                        value: `__Usage :__ \`${serverPrefix}unmute @User\`\n__Description :__ \`Vous permet de demute un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}kick`,
                        value: `__Usage :__ \`${serverPrefix}kick @User raison\`\n__Description :__ \`Vous permet de kick un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}ban`,
                        value: `__Usage :__ \`${serverPrefix}ban @User raison\`\n__Description :__ \`Vous permet de bannir un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}tempban`,
                        value: `__Usage :__ \`${serverPrefix}tempban @User number d/h/m/s raison\`\n__Description :__ \`Vous permet de bannir temporairement un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}unban`,
                        value: `__Usage :__ \`${serverPrefix}unban UserId\`\n__Description :__ \`Vous permet de débannir un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}clear`,
                        value: `__Usage :__ \`${serverPrefix}clear number\`\n__Description :__ \`Vous permet de supprimer une grande quantité de message dans un salon.\``
                    }
                ],
                timestamp: new Date(),
                footer: `Server ${guildName} | Bot ${botName}`
            },
                // Others Page //
            {
                color: 'fe6a16',
                author: {
                    name: `${botName} Bot`,
                    icon_url: bot.user.displayAvatarURL()
                },
                description: 'Voici les commandes de la catégorie **Divers** :',
                fields: [
                    {
                        name: `${serverPrefix}help`,
                        value: `__Usage :__ \`${serverPrefix}help\`\n__Description :__ \`Vous permet d'afficher la liste des commandes disponibles.\``
                    },
                    {
                        name: `${serverPrefix}prefix`,
                        value: `__Usage :__ \`${serverPrefix}prefix préfix\`\n__Description :__ \`Vous permet de modifier le préfix du bot.\``
                    },
                    {
                        name: `${serverPrefix}user-info`,
                        value: `__Usage :__ \`${serverPrefix}user-info @User\`\n__Description :__ \`Vous permet d'afficher des informations sur un utilisateur de votre serveur.\``
                    },
                    {
                        name: `${serverPrefix}bot-info`,
                        value: `__Usage :__ \`${serverPrefix}bot-info\`\n__Description :__ \`Vous permet d'afficher des informations sur le bot.\``
                    },
                    {
                        name: `${serverPrefix}bot-stats`,
                        value: `__Usage :__ \`${serverPrefix}bot-stats\`\n__Description :__ \`Vous permet d'afficher les statistiques du bot.\``
                    },
                    {
                        name: `${serverPrefix}ping`,
                        value: `__Usage :__ \`${serverPrefix}ping\`\n__Description :__ \`Vous permet d'afficher le ping du bot.\``
                    }
                ],
                timestamp: new Date(),
                footer: `Server ${guildName} | Bot ${botName}`
            }
        ]

        let x = 0
        const msg = await message.channel.send({ embed: embeds[x] })
    
        await msg.react('◀️')
        await msg.react('▶️')
        await msg.react('🔴')
    
        const collector = msg.createReactionCollector((react, user) => ['◀️', '▶️', '🔴'].includes(react.emoji.name) && user.id == message.author.id, { time: 2 * 60 * 1000 })

        collector.on('collect', async function(react) {
            switch (react.emoji.name) {
                case '◀️':
                    if (embeds[x - 1]) {
                        msg.edit({ embed: embeds[--x] }).catch(() => {})
                        const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                        try {
                            for (const reaction of userReactions.values()) {
                                await reaction.users.remove(message.author.id);
                            }
                        } catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                    }
                break
                case '▶️':
                    if (embeds[x + 1]) {
                        msg.edit({ embed: embeds[++x] }).catch(() => {})
                        const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                        try {
                            for (const reaction of userReactions.values()) {
                                await reaction.users.remove(message.author.id);
                            }
                        } catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                    }
                break
                case '🔴':
                    collector.stop()
                    msg.delete()
                    message.delete()
                break
            }
        })
    
        collector.on('end', () => msg.reactions.removeAll().catch(() => {}))
    })

        
        
    /*    const embed = new Discord.MessageEmbed()
            .setColor("#F04141")
            .setThumbnail(bot.user.displayAvatarURL())
            .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
            .setDescription("Voici la liste des commandes toutes catégories confondues : \n\n**Modération :** \n\n ** /kick** \n__Usage :__ `/kick @User raison`\n__Description :__ `Vous permet de kick un utilisateur de votre serveur.`\n\n ** /ban**\n__Usage :__ `/ban @User raison`\n__Description :__ `Vous permet de bannir un utilisateur de votre serveur.`\n\n ** /tempban**\n__Usage :__ `/tempban @User number d/h/m/s raison`\n__Description :__ `Vous permet de bannir temporairement un utilisateur de votre serveur.`\n\n ** /unban**\n__Usage :__ `/unban UserId`\n__Description :__ `Vous permet de débannir un utilisateur de votre serveur.`\n\n ** /clear**\n__Usage :__ `/clear number`\n__Description :__ `Vous permet de supprimer une grande quantité de message dans un salon.`\n\n")
            .setTimestamp()
            .setFooter(`Server ${guildName} | Bot ${botName}`)
        message.channel.send(embed)*/
    }
}