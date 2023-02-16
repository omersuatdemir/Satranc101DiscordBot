const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { plus2kRoleID, dbConnectionString } = require("../config.json");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getrole')
		.setDescription('Get the role.'),
	async execute(interaction) {

		const client = new MongoClient(dbConnectionString);
		async function run() {
		  try {
			const result = await client.db('denemeDB').collection('denemeCol').findOne({ discordID: interaction.user.id });
			console.log(result);

			if(result==null){
				interaction.reply('Kayıtlı lichess hesabınız bulunamadı.\n\`/linkaccount\` kullanmayı deneyin');
			}
			else{
				axios.get('https://lichess.org/api/user/'+result.lichessID)
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
			}

		  } finally {
			await client.close();
		  }
		}
		run().catch(console.dir);
	},
};