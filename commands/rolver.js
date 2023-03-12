const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { plus2kRoleID, dbConnectionString, mongoDB, mongoCol, oneYearRoleID, championRoleID } = require("../config.json");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolver')
		.setDescription('Sunucumuzda çeşitli roller alabilirsiniz.')
		.addStringOption(option =>
			option.setName('rol')
				.setDescription('Hesabinizi eşleştirmek istediğiniz platformu seçin.')
				.setRequired(true)
				.addChoices(
					{ name: '2000+', value: 'plus2k' },
					{ name: 'BirSenedirBurada', value: 'oneYear' },
					{ name: 'Şampiyon', value: 'champion' }
				)),

	async execute(interaction) {

		switch (interaction.options.getString('rol')) {
			case 'plus2k':
				//member.roles.cache.has('role-id-here');
				if (!interaction.member.roles.cache.has(plus2kRoleID)) {
					//kayıtların olduğu tablodan, kullanıcının id'sine göre bir kayıt bulmaya çalışıyor.
					const client = new MongoClient(dbConnectionString);

					try {
						const result = await client.db(mongoDB).collection(mongoCol).findOne({ discordID: interaction.user.id });

						//kayıt bulunursa istenilen rol için yeterlilikler kontrol ediliyor.
						if (result?.lichessID == null && result?.chesscomID == null) {
							interaction.reply('Teyitli hesabınız bulunamadı.\n\`/teyit\` kullanmayı deneyin');
						}
						else {

							var lichess_performanceProv = false;
							var lichess_prov = false;

							var chesscom_performanceProv = false;
							var chesscom_prov = false;

							//oyuncunun varsa lichess kayıtları kontrol ediliyor.
							axios.get('https://lichess.org/api/user/' + result.lichessID)
								.then(function (response) {

									var perfs = response.data?.perfs;

									if (perfs?.ultrabullet?.rating >= 2000) {
										if ((perfs?.ultrabullet?.rd <= 110) || ((perfs?.ultrabullet?.rating - perfs?.ultrabullet?.rd) >= 2000)) {
											prov = true;
										}
										lichess_performanceProv = true;
									}

									if (perfs?.blitz?.rating >= 2000) {
										if ((perfs?.blitz?.rd <= 110) || ((perfs?.blitz?.rating - perfs?.blitz?.rd) >= 2000)) {
											prov = true;
										}
										lichess_performanceProv = true;
									}

									if (perfs?.bullet?.rating >= 2000) {
										if ((perfs?.bullet?.rd <= 110) || ((perfs?.bullet?.rating - perfs?.bullet?.rd) >= 2000)) {
											prov = true;
										}
										lichess_performanceProv = true;
									}

									if (perfs?.classical?.rating >= 2000) {
										if ((perfs?.classical?.rd <= 110) || ((perfs?.classical?.rating - perfs?.classical?.rd) >= 2000)) {
											prov = true;
										}
										lichess_performanceProv = true;
									}

									if (perfs?.rapid?.rating >= 2000) {
										if ((perfs?.rapid?.rd <= 110) || ((perfs?.rapid?.rating - perfs?.rapid?.rd) >= 2000)) {
											prov = true;
										}
										lichess_performanceProv = true;
									}

									//yeterlilikler sağlanıyorsa üyeye istenilen rolü veriyor.
									if (lichess_prov == true) {
										interaction.member.roles.add(plus2kRoleID);
										const verifiedEmbed = new EmbedBuilder()
											.setColor(0x2cee1a)
											.setTitle('Lichess 2000+ Doğrulandı!')
											.setURL('https://lichess.org/@/' + result?.lichessID)
											.setDescription('2000+ başarıyla doğrulandı.\n'
												+ 'https://lichess.org/@/' + result?.lichessID)
											.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

										interaction.reply({ embeds: [verifiedEmbed] });
									}
								});

							//oyuncunun varsa chess.com kayıtları kontrol ediliyor.
							axios.get('https://api.chess.com/pub/player/' + result.chesscomID + '/stats')
								.then(function (response) {

									if (response.data?.chess_blitz?.last?.rating >= 2000) {
										if (((response.data?.chess_blitz?.last?.rating - response.data?.chess_blitz?.last?.rd) >= 2000) || (response.data?.chess_blitz?.last?.rd <= 50)) {
											prov = true;
										}
										chesscom_performanceProv = true;
									}

									if (response.data?.chess_bullet?.last?.rating >= 2000) {
										if (((response.data?.chess_bullet?.last?.rating - response.data?.chess_bullet?.last?.rd) >= 2000) || (response.data?.chess_bullet?.last?.rd <= 50)) {
											prov = true;
										}
										chesscom_performanceProv = true;
									}

									if (response.data?.chess_rapid?.last?.rating >= 2000) {
										if (((response.data?.chess_rapid?.last?.rating - response.data?.chess_rapid?.last?.rd) >= 2000) || (response.data?.chess_rapid?.last?.rd <= 50)) {
											prov = true;
										}
										chesscom_performanceProv = true;
									}

									//yeterlilikler sağlanıyorsa üyeye istenilen rolü veriyor.
									if (chesscom_prov == true) {
										interaction.member.roles.add(plus2kRoleID);

										const verifiedEmbed = new EmbedBuilder()
											.setColor(0x2cee1a)
											.setTitle('Chess.com 2000+ Doğrulandı!')
											.setURL('https://www.chess.com/member/' + result?.chesscomID)
											.setDescription('2000+ başarıyla doğrulandı.\n'
												+ 'https://lichess.org/@/' + result?.chesscomID)
											.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

										interaction.reply({ embeds: [verifiedEmbed] });
									}
									else {

										if (lichess_performanceProv == true || chesscom_performanceProv == true) {

											if (lichess_performanceProv == true && lichess_prov == false
												&& chesscom_performanceProv == true && chesscom_prov == false) {
												const invalidAccount = new EmbedBuilder()
													.setColor(0xec0505)
													.setTitle('Puan Sapma Değeriniz Yüksek')
													.setDescription('Her iki platformda da 2000 puanı geçtiğiniz tempolar olmuş ancak puan sapma değeriniz çok yüksek. Bu tempolarda yeterince oynamamış veya tutarlı performans göstermemiş olabilirsiniz. Bu tempolarda daha fazla oynayarak bu sorunu çözebilirsiniz.')
													.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

												interaction.reply({ embeds: [invalidAccount] });
											}

											if (lichess_performanceProv == true && lichess_prov == false
												&& chesscom_performanceProv == false && chesscom_prov == false) {
												const invalidAccount = new EmbedBuilder()
													.setColor(0xec0505)
													.setTitle('Lichess Puan Sapma Değeriniz Yüksek')
													.setDescription('Lichess platformunda 2000 puanı geçtiğiniz tempolar olmuş ancak puanlarınızın yanındaki soru işareti puan sapma değerinizin yüksek olduğunu gösteriyor. Bu soru işareti kalkana kadar oynayabilirsiniz.')
													.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

												interaction.reply({ embeds: [invalidAccount] });
											}

											if (lichess_performanceProv == false && lichess_prov == false
												&& chesscom_performanceProv == true && chesscom_prov == false) {
												const invalidAccount = new EmbedBuilder()
													.setColor(0xec0505)
													.setTitle('Chess.com Puan Sapma Değeriniz Yüksek')
													.setDescription('Chess.com platformunda 2000 puanı geçtiğiniz tempolar olmuş ancak puan sapma değeriniz çok yüksek. Bu tempolarda yeterince oynamamış veya tutarlı performans göstermemiş olabilirsiniz. Bu tempolarda daha fazla oynayarak bu sorunu çözebilirsiniz.')
													.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

												interaction.reply({ embeds: [invalidAccount] });
											}
										}
										else {
											const invalidAccount = new EmbedBuilder()
												.setColor(0xec0505)
												.setTitle('2000+ Doğrulanamadı')
												.setDescription('Herhangi bir tempoda 2000 puan değilsiniz.')
												.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

											interaction.reply({ embeds: [invalidAccount] });
										}
									}
								});
						}

					} finally {
						await client.close();
					}
				}
				else {
					const alreadyTaken = new EmbedBuilder()
						.setColor(0xec0505)
						.setTitle('Bu Role Zaten Sahipsiniz')
						.setDescription('+2000 rolüne zaten sahipsiniz.')
						.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

					interaction.reply({ embeds: [alreadyTaken] });
				}
				break;

			case 'oneYear':
				const date = new Date(interaction.member.joinedAt.getTime());
				const now = Date.now();
				const difference = now - date;
				const gun = difference / (1000 * 60 * 60 * 24);

				const str = parseInt(gun) + ' gündür sunucudasın';

				if (gun >= 365) {
					if (interaction.member.roles.cache.has(oneYearRoleID)) {
						const alreadyTaken = new EmbedBuilder()
							.setColor(0xec0505)
							.setTitle('Bu Role Zaten Sahipsiniz')
							.setDescription(str + '!')
							.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
						interaction.reply({ embeds: [alreadyTaken] });
					}
					else {
						const successful = new EmbedBuilder()
							.setColor(0x117dd6)
							.setTitle('Rol Eklendi')
							.setDescription(str + '!')
							.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
						interaction.member.roles.add(oneYearRoleID);
						interaction.reply({ embeds: [successful] });
					}


				} else {
					const unsuccessful = new EmbedBuilder()
						.setColor(0xec0505)
						.setTitle('Rol Eklenemedi')
						.setDescription(str + '.\nDaha ' + (365 - parseInt(gun)) + ' günün var.')
						.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
					interaction.reply({ embeds: [unsuccessful] });
				}
				break;

			case 'champion':
				if (!interaction.member.roles.cache.has(championRoleID)) {
					const client = new MongoClient(dbConnectionString);
					try {
						const result = await client.db(mongoDB).collection(mongoCol).findOne({ discordID: interaction.user.id });
						if (result == null) {
							const noVerif = new EmbedBuilder()
								.setColor(0xec0505)
								.setTitle('Teyitli Lichess Hesabı Bulunamadı')
								.setDescription('\`/teyit\` kullanmayı deneyebilirsiniz.')
								.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
							interaction.reply({ embeds: [noVerif] });
						}
						else {
							if (result?.tournamentPoints == null) {
								const noRecord = new EmbedBuilder()
									.setColor(0xec0505)
									.setTitle('Turnuva Puanı Kaydınız Yok')
									.setDescription('Bunun sebebi hiç turnuva kazanmamış veya hesabınızı teyit ettirmemiş olmanız olabilir. Sonraki turnuva puanlarınızın hesaplanması için \`/teyit\` kullanabilirsiniz. Önceki turnuva puanlarınızın hesaplanması için yetkililer ile iletişime geçin.')
									.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
								interaction.reply({ embeds: [noRecord] });
							}
							else {
								if (parseInt(result?.tournamentPoints) >= 24) {
									const successful = new EmbedBuilder()
										.setColor(0x117dd6)
										.setTitle('Rol Eklendi')
										.setDescription('Tebrikler 🎉\nToplam turnuva puanınız: ' + result.tournamentPoints)
										.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
									interaction.member.roles.add(championRoleID);
									interaction.reply({ embeds: [successful] });
								}
								else {
									const noVerif = new EmbedBuilder()
										.setColor(0xec0505)
										.setTitle('Yetersiz Puan')
										.setDescription('Şampiyon rolünü alabilmek için en az 24 puana ihtiyacınız var.\nSizin puanınız: ' + result.tournamentPoints)
										.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
									interaction.reply({ embeds: [noVerif] });
								}
							}
						}
					}
					catch (error) {

					}
				}
				else {
					const alreadyTaken = new EmbedBuilder()
						.setColor(0xec0505)
						.setTitle('Bu Role Zaten Sahipsiniz')
						.setDescription('Şampiyon rolüne zaten sahipsiniz.')
						.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

					interaction.reply({ embeds: [alreadyTaken] });
				}
				break;
			default:
				break;
		}
	},
};