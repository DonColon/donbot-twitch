const tmi = require('tmi.js');
const fs = require('fs');

// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();

// Load configuration of the bot
const { botName, channels, prefix } = require('./config.json');

const client = new tmi.Client({
    identity: {
		username: botName,
		password: process.env.TOKEN
	},
	channels: channels
});

client.commands = new Map();

// Read in all command files and register the command to client
const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.once('connected', (address, port) => {
	console.log(`Donbot is online at port ${port}`);
});

client.on('message', (channel, tags, message, self) => {
	// When message starts not with the command prefix ignore it
	if(!message.startsWith(prefix)) return;

	// When message is from a bot ignore it
	if(self) return;

	// Filter out command parameters and name from message
	const parameters = message.slice(prefix.length).trim().split(/ +/),
		  commandName = parameters.shift().toLowerCase();

	// Get command by name or search for an alias
	const command = client.commands.get(commandName) || client.commands.values().find(command => command.aliases.includes(commandName));

	// When no command was found by the name or alias ignore it
	if(!command) return;

	try {
		command.execute(channel, message, parameters, client);
	
	} catch(error) {
	
		console.error(error);
	} 
});

// Connect to twitch channels
client.connect();