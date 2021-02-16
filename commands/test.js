const Discord = require('discord.js');
const bot = new Discord.Client();
const mysql = require('mysql');

const db = new mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "guilddb"
});

module.exports = {
    name: "test",

    async execute(message, args, bot) {
        const list = bot.guilds.cache.get(message.guild.id);
        list.members.cache.forEach(member => {
            if (member.user.bot === true && member.user.username !== bot.user.username) {
                const modifiedRoles = member.guild.roles.cache.find(r => r.name === member.user.username);
                const rolePermissions = modifiedRoles.permissions.bitfield;
                var initialPermission = 0;

                if (args[1] === '1') {
                    console.log(member.user.username + " " + rolePermissions)
                    initialPermission = modifiedRoles.permissions.bitfield;
                    modifiedRoles.setPermissions(0)
                }

                if (args[1] === '2') {
                    modifiedRoles.setPermissions(rolePermissions)
                    console.log(member.user.username + " " + rolePermissions)
                    console.log(initialPermission)
                    console.log("Permission remis à tout les bots !")
                }
                

                /*setTimeout(() => {
                    modifiedRoles.setPermissions(rolePermissions)
                    console.log(member.user.username + " " + rolePermissions)
                    console.log("Permission remis à tout les bots !")
                }, 10000)*/
                
                // modifiedRoles.setPermissions(rolePermissions)
            }
        });
    }
}