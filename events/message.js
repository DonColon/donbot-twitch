// Load configuration of the bot
const { prefix } = require('../config.json');

module.exports = {
	name: 'message',
    once: false,
	execute(channel, tags, message, self, client) {
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
    
        // Check if command needs parameters and if parameters are specified
        if(command.hasParameter && parameters.length === 0) return;
    
        try {
            command.execute(channel, message, parameters, client);
        
        } catch(error) {
        
            console.error(error);
        } 
    }
};
