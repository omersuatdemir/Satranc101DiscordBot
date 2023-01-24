const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linkaccount')
		.setDescription('Link your Lichess account.')
		.addStringOption((option) =>
		option
		  .setName('id')
		  .setDescription('ID of your lichess account.')
		  .setRequired(true)
	  ),
	async execute(interaction) {
		const userName = interaction.user.username+'#'+interaction.user.discriminator;
		axios.get('https://lichess.org/api/user/'+interaction.options.getString('id'))
		.then(function (response){

			const verifiedEmbed = new EmbedBuilder()
			.setColor(0x2cee1a)
			.setTitle('Hesabınız Doğrulandı!')
			.setURL('https://lichess.org/@/'+interaction.options.getString('id'))
			.setDescription('Hesabınız başarıyla doğrulandı.')
			.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

			const unsuccessfulVerificationEmbed = new EmbedBuilder()
			.setColor(0xec0505)
			.setTitle('Hesabınız Doğrulanamadı')
			.setDescription('Lütfen Discord etiketinizi \"' + userName + '\" Lichess hesabınızın biyografisine koyun.')
			.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

			const lcBio = response.data.profile.bio;
			if(userName == lcBio){
				interaction.reply({ embeds: [verifiedEmbed] });
			} else{
				interaction.reply({ embeds: [unsuccessfulVerificationEmbed] });
			}
		});
	},
};