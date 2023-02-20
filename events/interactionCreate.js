const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const { discord_token } = require('../config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isChatInputCommand()){
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
	
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
		if (interaction.isButton()){

			interaction.update({ components: [row] });

			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('button1_disabled')
					.setLabel('Skor Tablosunu Göster')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
			);

			client.login(discord_token);

			client.on("ready", ()=>{
				client.channels.cache.get(interaction.channelId)
				.send('\`\`\`----Skor Tablosu-----\n1-isim1\n2-isim2\n3-isim3\`\`\`');
			})
		}

		return;
	},
};