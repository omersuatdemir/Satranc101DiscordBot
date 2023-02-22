const { SlashCommandBuilder } = require('discord.js');
const { plus2kRoleID, dbConnectionString, mongoDB, mongoCol } = require("../config.json");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolver')
		.setDescription('Teyitli hesabiniz kontrol edilecek.'),
	async execute(interaction) {

		//kayıtların olduğu tablodan, kullanıcının id'sine göre bir kayıt bulmaya çalışıyor.
		const client = new MongoClient(dbConnectionString);

		try {
			const result = await client.db(mongoDB).collection(mongoCol).findOne({ discordID: interaction.user.id });

			//kayıt bulunursa istenilen rol için yeterlilikler kontrol ediliyor.
			if(result?.lichessID == null && result?.chesscomID == null){
				interaction.reply('Teyitli hesabınız bulunamadı.\n\`/teyit\` kullanmayı deneyin');
			}
			else{
				var prov = false;

				//oyuncunun varsa lichess kayıtları kontrol ediliyor.
				axios.get('https://lichess.org/api/user/'+result.lichessID)
				.then(function (response){
		
					var perfs = response.data?.perfs;
		
					if(perfs?.ultrabullet?.rating >= 2000 && perfs?.ultrabullet?.prov == undefined){
						prov = true;
					}
					if(perfs?.blitz?.rating >= 2000 && perfs?.blitz?.prov == undefined){
						prov = true;
					}
					if(perfs?.bullet?.rating >= 2000 && perfs?.bullet?.prov == undefined){
						prov = true;
					}
					if(perfs?.classical?.rating >= 2000 && perfs?.classical?.prov == undefined){
						prov = true;
					}
					if(perfs?.rapid?.rating >= 2000 && perfs?.rapid?.prov == undefined){
						prov = true;
					}
		
					//yeterlilikler sağlanıyorsa üyeye istenilen rolü veriyor.
					if(prov){
						interaction.member.roles.add(plus2kRoleID);
						interaction.reply('2000+ doğrulandı.');
					}
				});

				//oyuncunun varsa chess.com kayıtları kontrol ediliyor.
				axios.get('https://api.chess.com/pub/player/' + result.chesscomID + '/stats')
				.then(function (response){

					console.log(response.data);
					
					if((response.data?.chess_blitz?.last?.rating - response.data?.chess_blitz?.last?.rd) >= 2000){
						prov = true;
					}
					if((response.data?.chess_bullet?.last?.rating - response.data?.chess_bullet?.last?.rd) >= 2000){
						prov = true;
					}
					if((response.data?.chess_rapid?.last?.rating - response.data?.chess_rapid?.last?.rd) >= 2000){
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
	},
};