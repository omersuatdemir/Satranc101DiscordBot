const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dbConnectionString } = require("../config.json");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('teyit')
		.setDescription('Lichess hesabinizi teyit edin.')
		.addStringOption((option) =>
		option
		  .setName('id')
		  .setDescription('Lichess hesabinizin ID\'si')
		  .setRequired(true)
	  ),
	async execute(interaction) {

		//kullanıcıdan teyit için isteyeceğimiz metni bir değişkene atıyoruz.
		const userName = interaction.user.username+'#'+interaction.user.discriminator;
		//lichess api ile kullanıcının lichess hesabının biyografi (açıklama) bölümüne erişiyoruz.
		axios.get('https://lichess.org/api/user/'+interaction.options.getString('id'))
		.then(function (response){

			const dbErrorEmbed = new EmbedBuilder()
			.setColor(0xec0505)
			.setTitle('Sunucu Hatası')
			.setDescription('Sunucu kaynaklı bir hatadan dolayı profiliniz bağlanamadı.\n'
			+ 'Bir süre sonra tekrar denemeyi veya yetkililer ile iletişime geçmeyi deneyebilirsiniz.')
			.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

			const unsuccessfulVerificationEmbed = new EmbedBuilder()
			.setColor(0xec0505)
			.setTitle('Hesabınız Doğrulanamadı')
			.setDescription('Lütfen Discord etiketinizi \"' + userName + '\" Lichess hesabınızın biyografisine koyun.')
			.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

			//biyografiyi bir değişkene atıyoruz.
			const lcBio = response.data.profile.bio;
			//teyit metni ile biyografiyi kıyaslıyoruz.
			if(userName == lcBio)
			{

				//teyit gerçekleşirse veri tabanı işlemleri başlıyor.
				const client = new MongoClient(dbConnectionString);
				async function run() 
				{
				  try 
				  {
					const result = await client.db('denemeDB').collection('denemeCol').findOne({ discordID: interaction.user.id });
					//üyenin daha önce kaydı yoksa yeni kayıt oluşturuyoruz.
					if (result == null) 
					{

						try {
							const doc = 
							{
								discordID: interaction.user.id,
								lichessID: response.data.id 
							}
							const result2 = await client.db('denemeDB').collection('denemeCol').insertOne(doc);
							console.log(result2);
							if(result2.acknowledged)
							{

								const verifiedEmbed = new EmbedBuilder()
								.setColor(0x2cee1a)
								.setTitle('Hesabınız Doğrulandı!')
								.setURL('https://lichess.org/@/'+ response.data.id)
								.setDescription('Hesabınız başarıyla doğrulandı.\n'
								+ 'https://lichess.org/@/'+ response.data.id)
								.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

								interaction.reply({ embeds: [verifiedEmbed] });
							}
							else
							{
								interaction.reply({ embeds: [dbErrorEmbed] });
							}
						}
						finally 
						{
							await client.close();
						}
					}
					else{
						//üyenin daha önceden kaydı varsa lichess id sini yeni girilen id ile değiştiriyoruz.
						try {
							const updateDoc = 
							{
								$set: 
								{
								  lichessID: interaction.options.getString('id')
								},
							  };
							const result3 = await client.db('denemeDB').collection('denemeCol')
							.updateOne({ discordID: interaction.user.id }, updateDoc);
							console.log(`${result3.matchedCount} document(s) matched the filter, updated ${result3.modifiedCount} document(s)`);
							if(result3.acknowledged){

								const updatedEmbed = new EmbedBuilder()
								.setColor(0x2cee1a)
								.setTitle('Hesabınız Güncellendi!')
								.setURL('https://lichess.org/@/'+ response.data.id)
								.setDescription('Hesabınız başarıyla güncellendi.\n'
								+ result.lichessID + ' -> ' + response.data.id)
								.setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

								interaction.reply({ embeds: [updatedEmbed] });
							}
							else{
								interaction.reply({ embeds: [dbErrorEmbed] });
							}
						  } finally {
							await client.close();
						}
					}
				  } finally {
					await client.close();
				  }
				}
				run().catch(console.dir);
			}
			else
			{
				interaction.reply({ embeds: [unsuccessfulVerificationEmbed] });
			}
		});

		
	},
};