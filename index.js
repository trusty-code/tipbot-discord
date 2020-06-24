const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const express = require('express');
const app = express();

const tip = require('./src/commands/tip');
const help = require('./src/commands/help');
const add = require('./src/commands/add');

require('dotenv').config()

const TOKEN = process.env.TOKEN

app.use('/qr_codes', express.static(__dirname + '/qr_codes'));

// functions
var cmds = {
    help,
    tip,
    add
}

const { COLOR, PREFIX } = require('./src/config');

client.on('message', async msg => {
    try {
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

client.login(TOKEN)

client.on('ready', () => {
    console.log(`Bot started as ${client.user.username}`)
})



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});