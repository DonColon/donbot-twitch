module.exports = {
    name: 'connected',
    once: true,
	execute(address, port, client) {
        console.log(`Donbot is online at port ${port}`);
    }
};