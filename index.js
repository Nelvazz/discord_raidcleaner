const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const config = require('./storage/config.json');
const bdd = require('./storage/warn.json')
const default_verifBot = config.default_verifBot;
const default_prefix = config.default_prefix;

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    console.log("\x1b[35m",`Fichier de commande ${file} récupéré avec succès !`)
};

bot.on("ready", async () => {
    console.log(" ")
    console.log("\x1b[32m", "Connecté en tant que : " + bot.user.tag)
    bot.user.setActivity(`/help | Membres : ${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`)
});


        // Join Server //

bot.on('guildCreate', (guild) => {
    console.log(`Joined new guild: ${guild.name}`);
    var modLog = guild.channels.create("sanction", {
        type: 'text'
    })
    
    const promiseChannel = Promise.resolve(modLog);
    promiseChannel.then((valueChannel) => {
        config + guild.id;
        config[guild.id] = {"verifbot": false, "modlogchannel": valueChannel.id};
        Savebdd();
    })

    guild.roles.create({
        data:{
            name:"Bot Confiné",
            color:"#383838"
        }
    }).then(result => {
        const channels = guild.channels.cache.filter(ch => ch.type !== 'category');
        channels.forEach(channel => {
            channel.updateOverwrite(result.id, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            })
        })
    })

    function Savebdd() {
        fs.writeFile('./storage/config.json', JSON.stringify(config, null, 4), (err) => {
            if (err) message.channel.send("Une erreur est survenue !");
        });
    }
    Savebdd();
});

bot.on('guildDelete', async (guild) => {
    console.log(`Left guild: ${guild.name}`);
    delete config[guild.id];
    Savebdd();

    function Savebdd() {
        fs.writeFile('./storage/config.json', JSON.stringify(config, null, 4), (err) => {
            if (err) message.channel.send("Une erreur est survenue !");
        });
    }
    Savebdd();
});

bot.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    
    var default_prefix = config.default_prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0];
    var args = messageArray.slice(1)
    var commands = bot.commands.get(command.slice(default_prefix.lenght))
    if (commands) commands.run(bot, message, args)
});

bot.login(config.token);


        // Bots Join Alerts //

bot.on('guildMemberAdd', async function(user, react) {
    let verifbot = await config[user.guild.id]["verifbot"];
    if (verifbot === false) return;
    let verifbotchannel = await config[user.guild.id]["verifbotchannel"];

    const guildName = user.guild.name;
    const botName = bot.user.username;
    if (!user.user.bot) return;
    let joinBotEmbed = new Discord.MessageEmbed()
        .setColor('#141414')
        .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/783617376615923722/binary-code.png')
        .setAuthor(user.user.username, user.user.avatarURL())
        .setDescription(`Le bot **${user.user.tag}** à rejoins le serveur, mais il pourrait être dangereux... \n Confirmez-vous son entrée ?`)
        .setTimestamp()
        .setFooter(`Server ${guildName} | Bot ${botName}`)
    let joinBotFunction = await user.guild.channels.cache.get(verifbotchannel).send(joinBotEmbed)
    await joinBotFunction.react('679355742590992414') && joinBotFunction.react('679420160452460580');
    user.roles.add(user.guild.roles.cache.find(r => r.name === "Bot Confiné"));

                // Reaction Collector //

    const collector = joinBotFunction.createReactionCollector((react, user) => ['679355742590992414', '679420160452460580'].includes(react.emoji.id) && user.id !== joinBotFunction.author.id, { time: 2 * 60 * 1000 })

    collector.on('collect', async function(react) {
        switch (react.emoji.id) {
            case '679355742590992414':
                var authorizedJoinEmbed = new Discord.MessageEmbed()
                    .setColor("#141414")
                    .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/783617376615923722/binary-code.png')
                    .setAuthor(user.user.username, user.user.avatarURL())
                    .setDescription(`Vous avez confirmé son entrée ! \nLe bot **${user.user.tag}** a été autorisé à rentrer dans le serveur.`)
                    .setTimestamp()
                    .setFooter(`Server ${guildName} | Bot ${botName}`)
                joinBotFunction.edit(authorizedJoinEmbed)
                user.roles.remove(user.guild.roles.cache.find(r => r.name === "Bot Confiné"))
                collector.stop()
            break;
            case '679420160452460580':
                var unauthorizedJoinEmbed = new Discord.MessageEmbed()
                    .setColor("#141414")
                    .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/783617376615923722/binary-code.png')
                    .setAuthor(user.user.username, user.user.avatarURL())
                    .setDescription(`Vous avez dénié son entrée ! \nLe bot **${user.user.tag}** n'a pas été autorisé à rentrer dans le serveur et a été expulser.`)
                    .setTimestamp()
                    .setFooter(`Server ${guildName} | Bot ${botName}`)
                joinBotFunction.edit(unauthorizedJoinEmbed)
                const memberKick = user.guild.member(user)
                memberKick.kick()
                collector.stop()
            break;
        }
    })

    collector.on('end', () => joinBotFunction.reactions.removeAll().catch(() => {}))
});


        // Server Locked Kick //

bot.on('guildMemberAdd', async user => {
    let serverlockedConfig = await config[user.guild.id]["serverlocked"];
    if(config[user.guild.id]["serverlocked"] === undefined) serverlockedConfig = false;

    if (serverlockedConfig === true) {
        const memberKick = user.guild.member(user);

        user.send("Le serveur est actuellement confiné.")
        setTimeout(() => {
            memberKick.kick()
        }, 400)
    } else {
        return;
    }
})

        // Base de Données //

function Savebdd() {
    fs.writeFile('./storage/config.json', JSON.stringify(config, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue !");
    });
}
Savebdd();

function Savebdd() {
    fs.writeFile('./storage/warn.json', JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue !");
    });
}
Savebdd();


        // Command Handler //

bot.on('message', async function (message) {
    if (message.channel.type == 'dm') return;
    let prefix = await config[message.guild.id]["prefix"];
    if (prefix === undefined) prefix = default_prefix;

    let args = message.content.substring(prefix.length).split(" ");
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    switch (args[0]) {
        case 'help':
            bot.commands.get('help').execute(message, args, bot);
            break;
                        // Modération Class //
        case 'warn':
            bot.commands.get('warn').execute(message, args, bot);
            break;
        case 'mute':
            bot.commands.get('mute').execute(message, args, bot);
            break;
        case 'tempmute':
            bot.commands.get('tempmute').execute(message, args, bot);
            break;
        case 'unmute':
            bot.commands.get('unmute').execute(message, args, bot);
            break;
        case 'kick':
            bot.commands.get('kick').execute(message, args, bot);
            break;
        case 'ban':
            bot.commands.get('ban').execute(message, args, bot);
            break;
        case 'tempban':
            bot.commands.get('tempban').execute(message, args, bot);
            break;
        case 'unban':
            bot.commands.get('unban').execute(message, args, bot);
            break;
        case 'clear':
            bot.commands.get('clear').execute(message, args, bot);
            break;
                        // Raid Cleaner Class //
        case 'clean':
            bot.commands.get('clean').execute(message, args, bot);
            break;
        case 'server-locked':
            bot.commands.get('server-locked').execute(message, args, bot);
            break;
        case 'join-verif':
            bot.commands.get('join-verif').execute(message, args, bot);
            break;
                        // Divers Class //
        case 'bot-info':
            bot.commands.get('bot-info').execute(message, args, bot);
            break;
        case 'user-info':
            bot.commands.get('user-info').execute(message, args, bot);
            break;
        case 'prefix':
            bot.commands.get('prefix').execute(message, args, bot);
            break;
        case 'ping':
            bot.commands.get('ping').execute(message, args, bot);
            break;
                        // TEST //
        case 'test':
            bot.commands.get('test').execute(message, args, bot);
            break;
    }
});