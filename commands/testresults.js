const { SlashCommandBuilder } = require('discord.js');
const { getresults } = require("../functions/getresults");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('testresults')
		.setDescription('Replies with Pong!')
        .addStringOption((option) =>
        option
          .setName("id")
          .setDescription(
            "ID of the tournament.")
          .setRequired(true)
      ),


	async execute(interaction) {
        const { default: axios } = require('axios');

        axios.get('https://lichess.org/api/tournament/' + interaction.options.getString("id") + '/results')
        .then(function (response) {
    
            var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
            var jsondata = JSON.parse(json);
            interaction.reply(jsondata[0].username + '\n' + jsondata[1].username + '\n' + jsondata[0].username);
        })
        .catch(function (error) {
          console.log(error);
        });
	},
};