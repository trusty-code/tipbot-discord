const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const express = require('express');
const app = express();
require('dotenv').config()

const tip = require('./src/commands/tip');
const help = require('./src/commands/help');
const add = require('./src/commands/add');
const del = require('./src/commands/del');

const tipbot = require('@trustify/tipbot.ts');

console.log("tipbot", tipbot)
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_URL = process.env.DB_URL
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

tipbot.setDB(`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_URL}:${DB_PORT}/${DB_NAME}`)


const TOKEN = process.env.TOKEN

app.use('/qr_codes', express.static(__dirname + '/qr_codes'));

// functions
var cmds = {
    help,
    tip,
    add,
    del
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