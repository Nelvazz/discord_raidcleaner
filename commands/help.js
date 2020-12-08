const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
    name: "help",

    async execute(message, args, bot) {
        const guildName = message.guild.name;
        const botName = bot.user.username;

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
                    name: '/clean',
                    value: "__Usage :__ \`/clean #channel-name\`\n__Description :__ \`Vous permet de supprimer une grande quantité de salon après un raid.\`"
                },
                {
                    name: '/server-locked',
                    value: "__Usage :__ \`/server-locked off | on\`\n__Description :__ \`Vous permet de bloquer les accès externes permettant de rejoindre votre serveur.\`"
                },
                {
                    name: '/join-verif',
                    value: "__Usage :__ \`/join-verif off | on [second-message] ChannelId\`\n__Description :__ \`Vous permet d'activer ou de désactiver le système de vérifications pour les bots externes au serveur.\`"
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
                    name: '/warn',
                    value: "__Usage :__ \`/warn @User raison\`\n__Description :__ \`Vous permet d'avertir un utilisateur de votre serveur.\`"
                },
                {
                    name: '/mute',
                    value: "__Usage :__ \`/mute @User\`\n__Description :__ \`Vous permet de mute un utilisateur de votre serveur.\`"
                },
                {
                    name: '/tempmute',
                    value: "__Usage :__ \`/tempmute @User\`\n__Description :__ \`Vous permet de mute temporairement un utilisateur de votre serveur.\`"
                },
                {
                    name: '/unmute',
                    value: "__Usage :__ \`/unmute @User\`\n__Description :__ \`Vous permet de demute un utilisateur de votre serveur.\`"
                },
                {
                    name: '/kick',
                    value: "__Usage :__ \`/kick @User raison\`\n__Description :__ \`Vous permet de kick un utilisateur de votre serveur.\`"
                },
                {
                    name: '/ban',
                    value: "__Usage :__ \`/ban @User raison\`\n__Description :__ \`Vous permet de bannir un utilisateur de votre serveur.\`"
                },
                {
                    name: '/tempban',
                    value: "__Usage :__ \`/tempban @User number d/h/m/s raison\`\n__Description :__ \`Vous permet de bannir temporairement un utilisateur de votre serveur.\`"
                },
                {
                    name: '/unban',
                    value: "__Usage :__ \`/unban UserId\`\n__Description :__ \`Vous permet de débannir un utilisateur de votre serveur.\`"
                },
                {
                    name: '/clear',
                    value: "__Usage :__ \`/clear number\`\n__Description :__ \`Vous permet de supprimer une grande quantité de message dans un salon.\`"
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
                    name: '/help',
                    value: "__Usage :__ \`/help\`\n__Description :__ \`Vous permet d'afficher la liste des commandes disponibles.\`"
                },
                {
                    name: '/prefix',
                    value: "__Usage :__ \`/prefix préfix\`\n__Description :__ \`Vous permet de modifier le préfix du bot.\`"
                },
                {
                    name: '/user-info',
                    value: "__Usage :__ \`/user-info @User\`\n__Description :__ \`Vous permet d'afficher des informations sur un utilisateur de votre serveur.\`"
                },
                {
                    name: '/bot-info',
                    value: "__Usage :__ \`/bot-info\`\n__Description :__ \`Vous permet d'afficher des informations sur le bot.\`"
                },
                {
                    name: '/ping',
                    value: "__Usage :__ \`/ping\`\n__Description :__ \`Vous permet d'afficher le ping du bot.\`"
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