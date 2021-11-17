// Add required libs
const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');

// Initialise Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Load .env file
require('dotenv').config();

// Debug when bot is loaded
client.once('ready', () => {
    console.debug('Floor Bot loaded!')
});

// ###
// EDIT YOUR SETTINGS HERE - BEGIN
// ###
// Add your desired projects here
let nftProjects = [
    'boredapeyachtclub',
    'thecryptodads',
    'lazy-lions'
];

// Add your Discord channel name to OpenSea collection-slug mapping here
let channelMapping = {
    '🦍boredapes':'boredapeyachtclub',
    '👨cryptodads':'thecryptodads',
    '🦁lazy-lions':'lazy-lions'
}
// ###
// EDIT YOUR SETTINGS HERE - END
// ###

let projects = new Map();

// Function to retrieve opensea floor prices for collections
getFloor = (customProjects) => {
    // Define api endpoint base for opensea collections
    let requestBase = 'https://api.opensea.io/api/v1/collection';
    let requests = [];

    // If user specifies a project, return the specific stats
    if (customProjects !== undefined && customProjects.length > 0){
        requests.push([customProjects,`${requestBase}/${customProjects}/stats`]);
    }else{
        // If user not specifies a project, return the stored projects stats
        nftProjects.forEach((projects, index) => {
            requests.push([projects,`${requestBase}/${projects}/stats`]);
        })
    }
    
    return requests;
}

sendMessages = (request,message) => {
    axios.get(request[1]).then(result => {
        let floorPrice = result.data.stats.floor_price;
        let collectionRequest = `https://api.opensea.io/api/v1/collection/${request[0]}`;
        axios.get(collectionRequest).then(result => {
            message.channel.send(`:small_red_triangle_down: **${result.data.collection.name}** Floor Price: ${floorPrice}ETH`);
        })
    }).catch(function (error) {
        if (error.response) {
            message.channel.send(`:monkey_face: **${error.response.status}**`);
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

    floorRequests.forEach((request, index) => {
        sendMessages(request,message);
    })
}

client.on('messageCreate', message => {
    // Define message prefix
    const prefix = '!floor';

    // Check if message starts with desired prefix
    if (message.content.startsWith(prefix)) {
        
        // Store message arguments in array
        let args = message.content.slice(prefix.length+1).trim().split(' ');

        if(args[0] === '' || args[0] === 'channel'){
            // If !floor or !floor channel use the channelname mapping to retrieve floor price
            channelCollection = channelMapping[`${message.channel.name}`];
            // If no matching mapping pair is found, load all defined collections
            if(channelCollection === undefined){
                callFloor('', message);
            }else{
                callFloor(`${channelCollection}`, message);
            }
        }else if(args[0] === 'all'){
            // If !floor all use all given collections to retrieve floor price
            callFloor('', message);
        }else{
            // If !floor <string> retrieve custom projects floor price
            callFloor(args[0], message);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);