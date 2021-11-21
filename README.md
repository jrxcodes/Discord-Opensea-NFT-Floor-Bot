# FloorBot
A discord bot for keeping track of collections floor prices.

## Usage
To Invite the bot to your server, use the [Discord invite link](https://discord.com/api/oauth2/authorize?client_id=910199554111078440&permissions=377957128192&scope=bot).
<br />
To get the current channels floor prices (see mapping in index.js, if other projects are needed setup the bot for your own, see below) , use the command:
<br />
 `!floor`
 <br />
To get  predefined collection floor prices, use the command:
<br />
`!floor all`
<br />
 To get specific collection floor prices, use the command:
 <br />
 `!floor <collection-slug>`
 
 ## Self Hosting
 If you would like to host the bot yourself, first set up a Discord bot through the Discord Developer portal and add the token to the .env file (DISCORD_TOKEN). Next, pull this repository onto your local machine:<br />
 `git clone <git_url>`
 <br>
 Open the .env file, and imput your API key in the correct space.
 <br />
 Next, ensure that you have NodeJS and NPM installed and run:
 <br />
 `npm install`
 <br />
 `node .`
 <br />
If you want to be just a little bit more advanced, I suggest you to use pm2 for your bot. If you want to run your bot with load balanced instances, you can use the command:
`pm2 start index.js -i 4`
 Congratulations! You now have a running Discord floor price bot.

If you want to say thank you, you can find me on Twitter @jrxcodes. 
The tipping feature in Bitcoin on Twitter is active, if you feel like it, I would really appreciate a tip/donation.
If the Ethereum network is your way to go, here is my tip wallet address: 0x0A5F16827d39f8c9227bbeE728FAeD7de12be807

This bot is inspired by https://github.com/ncitron/GasBot