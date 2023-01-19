const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const ChessImageGenerator = require("chess-image-generator")

let generator = new ChessImageGenerator({
    size:512,
    light: '#dee3e6',
    dark: '#8ca2ad',
    style: 'alpha',
    flipped: true
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("visualize")
        .setDescription("Generates chess board visual with given FEN string ")    
    .addStringOption(option => 
        option.setName("fen")
        .setDescription("FEN string to generate the board with")),
    async execute(interaction){

        let fen = interaction.options.getString("fen")
        await generator.loadFEN(fen)
        let buffer = await generator.generateBuffer()

        await interaction.reply({files:[buffer]})
    }
}