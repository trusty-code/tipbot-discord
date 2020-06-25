const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile
const os = require('os')

const keyv = new Keyv({
  store: new KeyvFile()
});
// More options with default value:
const customKeyv = new Keyv({
  store: new KeyvFile({
    filename: `./default-rnd-${Math.random().toString(36).slice(2)}.json`, // the file path to store the data
    expiredCheckDelay: 24 * 3600 * 1000, // ms, check and remove expired data in each ms
    writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
    encode: JSON.stringify, // serialize function
    decode: JSON.parse // deserialize function
  })
})


async function addAddress(user_id, address) {

    await keyv.set(user_id, address); // true

    console.log("user_id: ", user_id)
    console.log("address: ", address)


}

async function getAddress(user_id) {

    console.log("user_id", user_id)
    let address = await keyv.get(user_id); // true
    return address;
}

module.exports = {
    addAddress,
    getAddress
}