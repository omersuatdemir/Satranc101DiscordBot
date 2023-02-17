const { SlashCommandBuilder } = require('discord.js');
const { plus2kRoleID, dbConnectionString } = require("../config.json");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolver')
		.setDescription('Teyitli hesabiniz kontrol edilecek.'),
	async execute(interaction) {

		//kayıtların olduğu tablodan, kullanıcının id'sine göre bir kayıt bulmaya çalışıyor.
		const client = new MongoClient(dbConnectionString);
		async function run() {
		  try {
			const result = await client.db('denemeDB').collection('denemeCol').findOne({ discordID: interaction.user.id });
			console.log(result);

			//kayıt bulunursa istenilen rol için yeterlilikler kontrol ediliyor.
			if(result==null){
				interaction.reply('Teyitli lichess hesabınız bulunamadı.\n\`/teyit\` kullanmayı deneyin');
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
		
					//yeterlilikler sağlanıyorsa üyeye istenilen rolü veriyor.
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