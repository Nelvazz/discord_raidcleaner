const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');
const bot = new Discord.Client();
const config = require('./storage/config.json');
const bdd = require('./storage/warn.json');
const default_verifBot = config.default_verifBot;
const default_prefix = config.default_prefix;


        // Launch Xampp //

//var execFile = require('child_process').execFile;
//execFile('D:\\Games Storage\\Xampp\\xampp-control.exe');
//execFile('D:\\Games Storage\\Xampp\\mysql_start.bat');
//execFile('D:\\Games Storage\\Xampp\\apache_start.bat');


/*let sql;
const db = new mysql.createConnection({
    host: "192.168.1.72",
    password: "",
    user: "root",
    database: "guilddb"
});

db.connect(function (err) {
    if (err) throw err;
    console.log(" ")
    console.log("\x1b[32m", "- MySQL est connecté !")
})

let sqlwarn;
const dbwarn = new mysql.createConnection({
    host: "192.168.1.72",
    password: "",
    user: "root",
    database: "guild"
});

dbwarn.connect(function (err) {
    if (err) throw err;
    console.log(" ")
    console.log("\x1b[32m", "- MySQL Warn est connecté !")
})*/


bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    console.log("\x1b[35m", `- Fichier de commande ${file} récupéré avec succès !`)
};

bot.on("ready", async () => {
    console.log(" ")
    console.log("\x1b[32m", "- Connecté en tant que : " + bot.user.tag)

    const activities = [
        `/help Pour plus d'informations !`,
        `Raid not by SFR`,
        `Membres : ${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`,
        `Serveurs : ${bot.guilds.cache.size}`,
    ]

    let i = 0;
    setInterval(() => bot.user.setActivity(`${activities[i++ % activities.length]}`, { type: 'WATCHING' }), 15000)
});

bot.on("ready", async() => {
    const Guilds = bot.guilds.cache.map(guild => guild.name);
    console.log(Guilds);

    // Leave all server
    // const GuildsID = bot.guilds.cache.map(guild => guild.leave())
});


        // Join Server //

bot.on('guildCreate', (guild) => {
    console.log(`Joined new guild: ${guild.name}`);

            // Créer une nouvelle table //

    let sqlwarn = `CREATE TABLE g${guild.id} (user varchar(255), username varchar(255) NOT NULL, warn varchar(255) NOT NULL, reason varchar(2000) NOT NULL, PRIMARY KEY (user))`
    dbwarn.query(sqlwarn, function(err, reqwarn) {
        if (err) throw err;
        console.log("Guild enregistré dans une nouvelle table !")
    })

    var modLog = guild.channels.create("sanction", {
        type: 'text'
    });
    
    const promiseChannel = Promise.resolve(modLog);
    promiseChannel.then((valueChannel) => {
        db.query(`SELECT * FROM guild WHERE guild = ${guild.id}`, async (err, req) => {
            if (err) throw err;

            if (req.length < 1) {
                console.log(`Donnée du serveur ${guild.name} enregistré avec succès !`)

                sql = `INSERT INTO guild (guild, guildname, prefix, botverification, botverificationchannel, modlogchannel, serverlocked) VALUES (${guild.id}, '${guild.name}', '${undefined}', '${false}', '${undefined}', ${valueChannel.id}, '${false}')`
                db.query(sql, function(err) {
                    if (err) throw err;
                })
            } else {
                return;
            }
        })
    });

    guild.roles.create({
        data:{
            name:"Muted"
        }
    }).then(result => {
        const channels = guild.channels.cache.filter(ch => ch.type !== 'category');
        channels.forEach(channel => {
            channel.updateOverwrite(result.id, {
                SEND_MESSAGES: false
            })
        })
    });

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
    });
});


bot.on('guildDelete', async (guild) => {
    console.log(`Left guild: ${guild.name}`);
    db.query(`DELETE FROM guild WHERE guild = ${guild.id}`);
    dbwarn.query(`DROP TABLE g${guild.id}`);
});


bot.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(default_prefix)) return;

    var default_prefix = config.default_prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0];
    var args = messageArray.slice(1);
    var commands = bot.commands.get(command.slice(default_prefix.lenght));
    if (commands) commands.run(bot, message, args);
});

bot.login(config.token);


        // Parameter Message Owner //

bot.on("guildCreate", async (guild) => {
    await guild.members.fetch(guild.ownerID)
        .then(guildMember => sOwner = guildMember)

    const guildName = guild.name;
    const botName = bot.user.username;

    let parameterEmbed = new Discord.MessageEmbed()
        .setColor("#F04141")
        .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/798936213313945630/phishing.png')
        .setAuthor(`${botName} Bot`, bot.user.displayAvatarURL())
        .setDescription(`Merci de m'avoir ajouté à votre serveur !\nPlusieurs choses ont été créé sur votre serveur, voici un peu plus de détails :\n\n>>> \n- Un \`Rôle Bot Confiné\` qui est utilisé par le système de vérification.\n\n- Un \`Rôle Mute\` qui est utilisé par la commande \`/mute\`.\n\n- Un \`Salon Sanction\` qui est utilisé comme salon de logs par le bot.\n`)
        .setImage('https://media.discordapp.net/attachments/783617098780901397/790030837549760532/biggest.png?width=1250&height=701')
        .setTimestamp()
        .setFooter(`Server ${guildName} | Bot ${botName}`)
    guild.owner.user.send(parameterEmbed)
})



        // Check Mate Systeme //

bot.on("guildCreate", guild => {
    const channel = guild.channels.cache.find(
        (c) => c.type === "text" && c.permissionsFor(guild.me).has("SEND_MESSAGES")
    );
    if (channel) {
        if (guild.members.cache.get('466578580449525760')) {
            channel.send(`<@466578580449525760> 🤜💥🤛 <@782308461634781185>`);
        }
    }
});


        // Messages de bienvenues [Serveur SUPPORT ONLY] //

bot.on('guildMemberAdd', user => {
    if (user.guild.id !== '784949113505710080') return;
    const newUserEmbed = new Discord.MessageEmbed()
        .setColor('#FFC144')
        .setThumbnail(user.user.displayAvatarURL())
        .setAuthor(user.user.username, user.user.displayAvatarURL({ format: 'png', dynamic: 'true' }))
        .setDescription(`Bienvenue <@${user.user.id}> sur **${user.guild.name}** ! 🎉\n\nTu es le ${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}ème membres !\n\nSi tu as besoin d'aides, n'hésite pas à poser t'as question dans le salon <#785986671560097842> 😉`)
        .setTimestamp()
    user.guild.channels.cache.get('785987395735519252').send(newUserEmbed);
    user.roles.add('785980931051225128');
    user.roles.add('792705437757603861');
    user.roles.add('792542858803806248');
})


        // Bots Join Alerts //

bot.on('guildMemberAdd', async function(user, react) {
    db.query(`SELECT * FROM guild WHERE guild = ${user.guild.id}`, async (err, req) => {
        let verifbot = await req[0].botverification;
        if (verifbot === false) return;
        let verifbotchannel = await req[0].botverificationchannel;

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
        const modifiedRoles = user.guild.roles.cache.find(r => r.name === `${user.user.username}`);
        const rolePermissions = modifiedRoles.permissions.bitfield;
        // console.log(rolePermissions)
        modifiedRoles.setPermissions(0)

                    // Reaction Collector //

        const collector = joinBotFunction.createReactionCollector((react, user) => ['679355742590992414', '679420160452460580'].includes(react.emoji.id) && user.id !== joinBotFunction.author.id, { time: 2 * 60 * 1000 })

        collector.on('collect', async function(react, users) {

            if (!react.message.guild.member(users).hasPermission(8)) {
                react.users.remove(react.message.guild.member(users));
                return;
            }

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
                    modifiedRoles.setPermissions(rolePermissions)
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

        collector.on('end', () => {
            joinBotFunction.reactions.removeAll().catch(() => {})
            /*var expiredJoinEmbed = new Discord.MessageEmbed()
                .setColor("#141414")
                .setThumbnail('https://media.discordapp.net/attachments/783617098780901397/783617376615923722/binary-code.png')
                .setAuthor(user.user.username, user.user.avatarURL())
                .setDescription(`Vous avez attendu trop longtemps ! \nLe bot **${user.user.tag}** a été expulser du serveur.`)
                .setTimestamp()
                .setFooter(`Server ${guildName} | Bot ${botName}`)
            joinBotFunction.edit(expiredJoinEmbed)
            const memberKick = user.guild.member(user)
            memberKick.kick()*/
        })
    })
    
});


        // Server Locked Kick //

bot.on('guildMemberAdd', async user => {
    db.query(`SELECT * FROM guild WHERE guild = ${user.guild.id}`, async (err, req) => {
        let serverlockedConfig = await req[0].serverlocked;
        if(serverlockedConfig === undefined) serverlockedConfig = false;

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
    
})


        // Command Handler //

bot.on('message', async function (message) {
    if (message.channel.type == 'dm') return;
    if (message.author.bot) return;

    db.query(`SELECT * FROM guild WHERE guild = ${message.guild.id}`, async (err, req) => {

        let prefix = req[0].prefix;
        if (prefix === "undefined") prefix = default_prefix;
        if (message.content === "<@782308461634781185>" || message.content === "<@!782308461634781185>") return message.channel.send(`Mon préfix sur ce serveur est : \`${prefix}\``);
        if (!message.content.startsWith(prefix)) return;

        let args = message.content.substring(prefix.length).split(" ");

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
            case 'config':
                bot.commands.get('config').execute(message, args, bot);
                break;
                            // Divers Class //
            case 'bot-info':
                bot.commands.get('bot-info').execute(message, args, bot);
                break;
            case 'bot-stats':
                bot.commands.get('bot-stats').execute(message, args, bot);
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
    })
});