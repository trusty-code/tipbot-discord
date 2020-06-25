const { MessageEmbed } = require('discord.js');

const { COLOR } = require('../config');
const { addAddress } = require('../database');

module.exports =
    function add(msg, args) {

        let address = args[0];

        if(isValidIotaAddress(address)) {

            addAddress(msg.author.id, address)

            const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle('Add - IOTA Tipbot')
                // Set the color of the embed
                .setColor(COLOR)
                // Set the main content of the embed
                .setDescription('Address added.');
            msg.channel.send(embed);
        } else {
            msg.channel.send("No Valid IOTA Address");
        }

      
    }


function isValidIotaAddress(address) {

    // TODO 
    if(address) return true
    return false
}