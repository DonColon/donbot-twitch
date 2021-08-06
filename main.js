const Twitch = require('tmi.js');
const fs = require('fs');

// Load environment variables into process
const dotenv = require('dotenv');
dotenv.config();

// Load configuration of the bot
const { prefix } = require('./config.json');

const client = new Twitch.Client({
    identity: {
		username: 'Donbot',
		password: process.env.TOKEN
	},
	channels: [ 
        'DonColon' 
    ]
});

client.on('connected', (address, port) => {
	console.log(`Donbot is online at port ${port}`);
});

client.on('message', (channel, tags, message, self) => {
    if(message === `${prefix}ping`) {
		client.say(channel, `pong`);
	}
});

client.connect();