const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birsene')
		.setDescription('---'),
	async execute(interaction) {
        const date = new Date(interaction.member.joinedAt.getTime());
        const now = Date.now();
        const difference = now - date;
        const oneYear = 1000 * 60 * 60 * 24 * 365;
        const newdate = new Date(difference);

        const str = parseInt(difference / (1000*60*60*24)) + ' gündür sunucudasın';
        console.log(str);

        if (difference >= oneYear) {
        const verifiedEmbed = new EmbedBuilder()
        .setColor(0x117dd6)
        .setTitle('Başarılı')
        .setDescription(str + '!')
        interaction.reply({ embeds: [verifiedEmbed] });
            
        } else {
        const verifiedEmbed = new EmbedBuilder()
        .setColor(0xec0505)
        .setTitle('Başarısız')
        .setDescription(str + '.')

        interaction.reply({ embeds: [verifiedEmbed] });
        }
    },
};
