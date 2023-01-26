const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { plus2kRoleID } = require("../config.json");
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getrole')
		.setDescription('Get the role.')
		.addStringOption((option) =>
		option
		  .setName('id')
		  .setDescription('ID of your lichess account.')
		  .setRequired(true)
	  ),
	async execute(interaction) {
		axios.get('https://lichess.org/api/user/'+interaction.options.getString('id'))
		.then(function (response){

			var perfs = response.data.perfs;
			var prov = false;

			if(perfs.ultrabullet?.rating >= 2000 && perfs.ultrabullet?.prov == undefined){
				prov = true;
			}
			if(perfs.blitz?.rating >= 2000 && perfs.blitz?.prov == undefined){
				prov = true;
			}
			if(perfs.bullet?.rating >= 2000 && perfs.bullet?.prov == undefined){
				prov = true;
			}
			if(perfs.classical?.rating >= 2000 && perfs.classical?.prov == undefined){
				prov = true;
			}
			if(perfs.rapid?.rating >= 2000 && perfs.rapid?.prov == undefined){
				prov = true;
			}

			if(prov){
				interaction.member.roles.add(plus2kRoleID);
				interaction.reply('2000+ doğrulandı.');
			}
			else{
				interaction.reply('2000+ doğrulanamadı.');
			}
		});
	},
};