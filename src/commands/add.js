const { MessageEmbed } = require('discord.js');

const { COLOR } = require('../config');
const { addAddress } = require('../database');
const tipbot = require('@trustify/tipbot.ts');
const checksum = require('@iota/checksum')

module.exports =
    async function add(msg, args) {

        let address = args[0];
        let user = String(msg.author.id);
        let response = await tipbot.add(user, address)

        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle('Add - IOTA Tipbot')
            // Set the color of the embed
            .setColor(COLOR)
            // Set the main content of the embed
            .setDescription(response);

        msg.channel.send(embed);
    }
