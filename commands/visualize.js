const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const ChessImageGenerator = require("chess-image-generator")

let generator = new ChessImageGenerator({
    size:256,
    light: 'rgb(200, 200, 200)',
    dark: 'rgb(100, 100,100)',
    style: 'merida',
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