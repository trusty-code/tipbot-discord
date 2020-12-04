const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../config');
const tipbot = require('@trustify/tipbot.ts');

module.exports =
    async function del(msg, args) {

        let address = args[0];
        let user = String(msg.author.id);
        let response = await tipbot.del(user)

        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle('Delete - IOTA Tipbot')
            // Set the color of the embed
            .setColor(COLOR)
            // Set the main content of the embed
            .setDescription(response);

        msg.channel.send(embed);
    }