const tmi = require('tmi.js');
const fs = require('fs');

// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();

// Load configuration of the bot
const { botName, channels } = require('./config.json');


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

// Read in all event files and register the event to client
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Connect to twitch channels
client.connect();