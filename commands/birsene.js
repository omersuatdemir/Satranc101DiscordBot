const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birsene')
		.setDescription('Sunucuda bir yildir bulunanlar için özel rol.'),
	async execute(interaction) {
        const date = new Date(interaction.member.joinedAt.getTime());
        const now = Date.now();
        const difference = now - date;
        const gun = difference / (1000*60*60*24);

        const str = parseInt(gun) + ' gündür sunucudasın';

        if (gun >= 365) {
        const successful = new EmbedBuilder()
        .setColor(0x117dd6)
        .setTitle('Rol Eklendi')
        .setDescription(str + '!')
        .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
        interaction.reply({ embeds: [successful] });
            
        } else {
        const unsuccessful = new EmbedBuilder()
        .setColor(0xec0505)
        .setTitle('Rol Eklenemedi')
        .setDescription(str + '.\nDaha ' + (365 - parseInt(gun)) + ' günün var.')
        .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
        interaction.reply({ embeds: [unsuccessful] });
        }
    },
};
