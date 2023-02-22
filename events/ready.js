const { Events } = require('discord.js');
const {PuzzleSystem} = require('../systems/puzzleSystem/puzzleSystem');
const { puzzleChannelId } = require('../config.json');


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		var x = PuzzleSystem.start(client, puzzleChannelId);
		x.schedule();
	},
};