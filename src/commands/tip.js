var QRCode = require('qrcode')
const request = require('request');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../config');

const isGithubUrl = require('is-github-url');
const getPackageJsonFromGithub = require('get-package-json-from-github');
const { getAddress } = require('../database');

module.exports = function tip(msg, args) {

    console.log("args", args)

    if (validURL(args[0])) {

        let url = args[0]
        if (isGithubUrl(url)) {
            console.log("isGithubUrl: ", url)

            // check in package.json meta
            getPackageJsonFromGithub(url)
                .then(packageJson => {
                    console.log('packageJson name:', packageJson.name);
                    console.log('packageJson name:', packageJson);
                    if (packageJson.iota_address) {
                        console.log('iota address found');
                        sendDonationMessage(msg, packageJson.name, packageJson.iota_address)
                    } else {
                        // TODO: Add error message with "howto instructions"
                    }
                });
            // TODO: check in cargo.toml meta
            // TODO: check in trustify meta

        } else {
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
                    sendDonationMessage(msg, args[0], found.donation_address)
                } else {

                    request(url, { json: true }, (err, res, body) => {
                        if (err) { return console.log(err); }
                        console.log("res", res)
                        console.log("body", body)

                        if (body.donation_address) {
                            let name = url;
                            if(body.name) {
                                name = body.name + `\n${url}`
                            }
                            sendDonationMessage(msg, name, body.donation_address)
                        } else {
                            console.log("website not found.")
                            msg.channel.send("Website not found in Trustify registry :-(");
                        }
                    })


                }
            });
        }


    } else if (args[0].substring(0, 3) == "<@!") {
        // Discord user: '<@!ID>'
        let user_id = {
            id: args[0].substring(3, args[0].length - 1)
        }

        console.log("tip to discord user_id", user_id)
        getAddress(user_id.id).then((address) => {

            console.log("what?")
            console.log("what?", address)
            console.log("user address: ", address)

            let embed;
            if (address) {
                sendDonationMessage(msg, args[0], address)
            } else {
                embed = new MessageEmbed()
                    // Set the title of the field
                    .setTitle('Tip - IOTA Tipbot')
                    // Set the color of the embed
                    .setColor(COLOR)
                    // Set the main content of the embed
                    .setDescription(`User ${args[0]} has no iota address. \n
                ${args[0]} you can add by writing **/add <your address** here in the chat or directly to the Trustify TipBot.`);

                msg.channel.send(embed);
            }
        })
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

function sendDonationMessage(msg, name, donation_address) {
    QRCode.toDataURL(donation_address).then((res) => {
        var base64Data = res.replace(/^data:image\/png;base64,/, "");

        fs.writeFileSync("./qr_codes/" + donation_address + ".jpg", base64Data, 'base64');
        // Now save the data
        const img_url = "http://localhost:3000/qr_codes/" + donation_address + ".jpg"
        console.log("img_url", img_url)
        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle(`Donate now to: `)
            // Set the color of the embed
            .setColor(COLOR)
            .setDescription(`\n\n**${name}** \n\n Spend  IOTA with your IOTA Wallet. Just copy the address or scan the QR code.`)
            .attachFiles(img_url)
            .setImage('attachment://' + donation_address + ".jpg")
            .addFields([
                {
                    name: "IOTA Address",
                    value: donation_address
                }
            ])
            // Set the main content of the embed
            .setFooter(
                'Trustify IOTA TipBot'
            )
        msg.channel.send(embed);
    }).catch(err => {
        console.error(err)
    })
}