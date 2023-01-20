const { SlashCommandBuilder } = require("discord.js");
const { ChessboardBuilder } = require("../utility/chessboardBuilder")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("visualize")
        .setDescription("Generates chess board visual with given FEN string ")
        .addStringOption(option =>
            option.setName("fen")
                .setDescription("FEN string to generate the board with")),
    async execute(interaction)
    {

        let buffer = await ChessboardBuilder.create()
            .setFen(interaction.options.getString("fen"))
            .generateBuffer()

        await interaction.reply({ files: [buffer] })
    }
}