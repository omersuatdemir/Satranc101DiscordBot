const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {lichess_token} = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createtournament')
		.setDescription('creates a tournament')

        .addStringOption(option =>
            option.setName('name')
                .setDescription('The tournament name. Leave empty to get a random Grandmaster name')
                .setRequired(true))

        .addStringOption(option => 
            option.setName('clocktime')
                .setDescription('Clock initial time in minutes')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('clockincrement')
                .setDescription('Clock increment in seconds')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('minutes')
                .setDescription('How long the tournament lasts, in minutes')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('waitminutes')
            .setDescription('How long to wait before starting the tournament, from now, in minutes'))

        .addStringOption(option =>
            option.setName('startdate')
            .setDescription('Timestamp to start the tournament at a given date and time. Overrides the waitMinutes setting'))

        .addStringOption(option =>
            option.setName('description')
            .setDescription('Anything you want to tell players about the tournament')),

	execute(interaction) {
        
        var informationMessage;

        const params = new URLSearchParams();

        params.append('conditions.teamMember.teamId','taskn-satranc');
        params.append('name',interaction.options.getString('name'));
        params.append('clockTime',interaction.options.getString('clocktime'));
        params.append('clockIncrement',interaction.options.getString('clockincrement'));
        params.append('minutes',interaction.options.getString('minutes'));
        params.append('description', interaction.options.getString('description'));

        axios.post("https://lichess.org/api/tournament", params, {headers: {Authorization: 'Bearer ' + lichess_token}})
        .then(function (response) {
            informationMessage = 'Turnuva Kuruldu!\nTurnuva Adı: ' +  response.data.fullName
            + '\nBağlantı: https://lichess.org/tournament/' + response.data.id
            + '\nBaşlangıç: ' + response.data.startsAt
            + '\nSüre: ' + response.data.minutes
            + '\nTempo: ' + (response.data.clock.limit / 60) + '+' + response.data.clock.increment;

            interaction.reply(informationMessage);
        });
	},
};