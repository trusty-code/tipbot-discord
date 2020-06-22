const { Client, MessageEmbed, MessageAttachment } = require('discord.js');
const client = new Client();
const request = require('request');
const fs = require('fs');
const express = require('express');
const app = express();

const config = require('dotenv').config().parsed // Loads .env

var QRCode = require('qrcode')

app.use('/qr_codes', express.static(__dirname + '/qr_codes'));

// functions
var cmds = {
    help,
    tip
}

const PREFIX = "!"
const COLOR = "#0FC1B7"

client.on('message', async msg => {
    try {
        //return if other channel
        // if (msg.channel.id != config.CHANNEL_ID) return
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
        .setTitle('Help - IOTA Tipbot')
        // Set the color of the embed
        .setColor(COLOR)
        // Set the main content of the embed
        .setDescription('How can i help you?');
    msg.channel.send(embed);
}

function tip(msg, args) {
    if (validURL(args[0])) {
        request('https://raw.githubusercontent.com/trusty-code/tipbot-backend/master/data/websites.json', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            var found = false;
            for (var i = 0; i < body.length; i++) {
                console.log(body[i].url);
                console.log(args[0]);
                if (body[i].url.toLowerCase().includes(args[0].toLowerCase())) {
                    found = body[i];
                    break;
                }
            }
            if (found) {
                QRCode.toDataURL(found.donation_address).then((res) => {
                    var base64Data = res.replace(/^data:image\/png;base64,/, "");

                    fs.writeFileSync("./qr_codes/" + found.donation_address + ".jpg", base64Data, 'base64');
                    // Now save the data
                    const img_url = "http://localhost:3000/qr_codes/" + found.donation_address + ".jpg"
                    console.log("img_url", img_url)
                    const embed = new MessageEmbed()
                        // Set the title of the field
                        .setTitle(`Donate to: ${args[0]}`)
                        // Set the color of the embed
                        .setColor(COLOR)
                        .attachFiles(img_url)
                        // Set the main content of the embed
                        .setDescription(img_url);

                    msg.channel.send(embed);
                }).catch(err => {
                    console.error(err)
                })
            } else {
                console.log("website not found.")
                msg.channel.send("Website not found in Trustify registry :-(");
            }
        });
    } else {
        msg.channel.send("tip to: ", args[0]);
    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});