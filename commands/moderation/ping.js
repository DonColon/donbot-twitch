module.exports = {
    name: 'ping',
    description: 'Ping pong',
    aliases: [],
    hasParameter: false,
    usage: '',
    execute(channel, message, parameters, client) {
        client.say(channel, `pong`);
    }
};