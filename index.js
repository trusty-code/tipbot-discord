const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const config = require('dotenv').config().parsed // Loads .env

// functions
var cmds = {
    help
}

const PREFIX = "$"

client.on('message', async msg => {
    try {
        //return if other channel
        if (msg.channel.id != config.CHANNEL_ID) return
        // Getting content, author and channel out of message object
        let cont = msg.content,
            author = msg.author
        //ignore bots
        if (author.bot) return;

        if (cont.startsWith(PREFIX)) {
            let cmd = cont.split(' ')[0].substr(PREFIX.length),
                args = cont.split(' ').slice(1)
            //call function
            if (cmd in cmds) {
                cmds[cmd](msg, args)
            }
        }
    } catch (err) {
        console.log(err)
    }
})

client.login(config.TOKEN)

client.on('ready', () => {
    console.log(`Bot started as ${client.user.username}`)
})


function help(msg) {
    const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle('A slick little embed')
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setDescription('Hello, this is a slick embed!');
    msg.channel.send(embed);
}