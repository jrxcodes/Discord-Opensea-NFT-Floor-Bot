// Add required libs
const {Client, Intents} = require('discord.js');
const axios = require('axios');

// Initialise Discord client
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

// Load .env file
require('dotenv').config();

// Debug when bot is loaded
client.once('ready', () => {
    console.debug('Floor Bot loaded!')
});

// Get whitelist and channel list from .env
let botChannelWhitelist = process.env.BOT_CHANNEL_WHITELIST.split(",");
let nftProjects = process.env.NFT_PROJECT_LIST.split(",");

// ###
// EDIT YOUR SETTINGS HERE - BEGIN
// ###
// Add your Discord channel name to OpenSea collection-slug mapping here
let channelMapping = {
    '🦍boredapes': ['boredapeyachtclub', 'mutant-ape-yacht-club', 'bored-ape-kennel-club'],
    '👨cryptodads': ['thecryptodads'],
    '🦁lazy-lions': ['lazy-lions'],
    '🦁 | general': ['thecheekylionclub ']
}
const notFoundError = `:monkey_face: **404**: Collection not found. Please enter Opensea URL-slug. (example: boredapesyachtclub)`;
const restrictedError = `:monkey_face: **Channel restricted** Please move to your Discords bot channel.`;
// ###
// EDIT YOUR SETTINGS HERE - END
// ###

// Function to retrieve opensea floor prices for collections
getFloor = (customProjects) => {
    // Define api endpoint base for opensea collections
    let requestBase = 'https://api.opensea.io/api/v1/collection';
    let requests = [];

    // If user specifies a project, return the specific stats
    if (customProjects !== undefined && customProjects.length > 0) {
        requests.push([customProjects, `${requestBase}/${customProjects}/stats`]);
    } else {
        // If user not specifies a project, return the stored projects stats
        nftProjects.forEach((projects) => {
            requests.push([projects, `${requestBase}/${projects}/stats`]);
        })
    }

    return requests;
}

sendMessages = (request, message) => {
    axios.get(request[1]).then(result => {
        // Get floor price from result
        let floorPrice = result.data.stats.floor_price;

        // Get human readable collection name from opensea
        let collectionRequest = `https://api.opensea.io/api/v1/collection/${request[0]}`;
        axios.get(collectionRequest).then(result => {
            // Send floor price info to channel
            message.channel.send(`:small_red_triangle_down: **${result.data.collection.name}** Floor Price: ${floorPrice}ETH`);
        })
    }).catch(function (error) {
        // Catch errors
        if (error.response) {
            let errorMessage = notFoundError;
            // If statuscode is different from 404, send the statuscode to the user.
            if (error.response.status !== 404) {
                errorMessage = `:monkey_face: **${error.response.status}** Please try again later.`;
            }
            // Send error message
            message.channel.send(`${errorMessage}`);
        } else if (error.request) {
            message.channel.send(`:monkey_face: **Request Error**`);
        } else {
            message.channel.send(`:monkey_face: **${error.message}**`);
        }
    })
}

callFloor = (collection, message) => {
    // Call floor function to send floor information as discord message
    let floorRequests = getFloor(collection);

    // Send a message for each collections floor request
    floorRequests.forEach((request) => {
        sendMessages(request, message);
    })
}

client.on('messageCreate', message => {
    // Define message prefix
    const prefix = '!floor';

    // Check if message starts with desired prefix
    if (message.content.startsWith(prefix)) {

        // Store message arguments in array
        let args = message.content.slice(prefix.length + 1).trim().split(' ');

        // If channel is whitelisted, allow custom project retrieving
        if (botChannelWhitelist.includes(`${message.channel.name}`) && args[0] !== 'all') {
            // If !floor <string> retrieve custom projects floor price
            callFloor(args[0], message);
        } else if (args[0] === '') {
            let channelCollection = channelMapping[`${message.channel.name}`];
            // If no matching mapping pair is found, load all defined collections from .env
            if (channelCollection === undefined) {
                //callFloor('', message); // If you want to send the predefined projects floor prices
                console.debug(restrictedError); // If you want to prevent spam in not whitelisted channels
                //message.channel.send(restrictedError); // If you want to send an error to the channel
            } else {
                // If !floor use the channelname mapping to retrieve floor price
                channelCollection.forEach((collection) => {
                    callFloor(`${collection}`, message);
                })
            }
        } else if (args[0] === 'all' && botChannelWhitelist.includes(`${message.channel.name}`)) {
            // If !floor all use all given collections to retrieve floor price
            callFloor('', message);
        } else {
            // If !floor all is called in a not whitelisted channel
            //callFloor('', message); // If you want to send the predefined projects floor prices
            console.debug(restrictedError); // If you want to prevent spam in not whitelisted channels
            //message.channel.send(restrictedError); // If you want to send an error to the channel
        }
    }
});

// Bot login via Discord token from .env
client.login(process.env.DISCORD_TOKEN);