const { MessageEmbed } = require('discord.js');

const { COLOR } = require('../config');
const { addAddress } = require('../database');
const checksum = require('@iota/checksum')

module.exports =
    async function add(msg, args) {

        let address = args[0];

        let isValid = await isValidIotaAddress(address)
        console.log("isValid", isValid)
        if (isValid) {

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


async function isValidIotaAddress(address) {

    // Check if address has valid formats (90 chars: 81 + 9 for the checksum and just trytes (A-Z and 9)) 
    try {
        // Check if address has valid checksum
        let isValid = checksum.isValidChecksum(address)
        if(isValid) return true
        return false 
    } catch (error) {
        return false
    }
}