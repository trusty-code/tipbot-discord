const { MessageEmbed } = require('discord.js');

const { COLOR } = require('../config');

module.exports =
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