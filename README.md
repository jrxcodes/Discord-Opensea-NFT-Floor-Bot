# FloorBot
A discord bot for keeping track of collections floor prices.

## Usage
To Invite the bot to your server, use the [Discord invite link](https://discord.com/api/oauth2/authorize?client_id=910199554111078440&permissions=377957128192&scope=bot).
<br />
To get the current channels floor prices (mapping in index.js required) or predefined collection floor prices, use the command:
<br />
 `!floor`
 <br />
 To get specific collection floor prices, use the command:
 <br />
 `!floor <collection-slug>`
 
 ## Self Hosting
 If you would like to host the bot yourself, first set up a Discord bot through the Discord Developer portal. Also obtain an API key from 
 [OpenSea.io](https://docs.opensea.io/reference/request-an-api-key). Next, pull this repository onto your local machine:<br />
 `git clone <git_url>`
 <br>
 Open the .env file, and imput your API keys in the correct spaces.
 <br />
 Next, ensure that you have NodeJS and NPM installed and run:
 <br />
 `npm install`
 <br />
 `node .`
 <br />
 Congratulations! You now have a running Discord floor price bot.
