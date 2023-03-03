const { SlashCommandBuilder } = require('discord.js');
const { PuzzleSystem } = require("../systems/puzzleSystem/puzzleSystem");
const { ChessboardBuilder } = require('../utility/chessboardBuilder');
const { enToTr, trToEn } = require('../functions/san-translation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bulmaca')
        .setDescription('Mevcut bulmacayi çözün')
        .addStringOption(option =>
            option.setName("hamle")
                .setDescription("Hamlelerinizi SAN formatinda yazin.")
                .setRequired(true)),
    async execute(interaction) {

        let activePuzzle = PuzzleSystem.instance?.activePuzzle

        if (activePuzzle === undefined) {
            await interaction.reply({ content: "Şuan aktif bir bulmaca bulunmuyor", ephemeral: true })
        } else {
            let move = trToEn(interaction.options.getString("hamle"))

            var result = activePuzzle.checkSolution(interaction.user.id, move)

            switch (result.status) {
                case "alreadySolved":
                    await interaction.reply({ content: "Bu bulmacayı zaten çözdün", ephemeral: true })
                    return
                case "progress":
                    {
                        let buffer = await ChessboardBuilder.create()
                            .setFen(result.fen)
                            .setHighlight([result.opponentMove.from, result.opponentMove.to])
                            .setPov(activePuzzle.playerSide)
                            .generateBuffer()

                        await interaction.reply({ files: [buffer], content: `Doğru hamle! Rakibin ${enToTr(result.opponentMove.san)} oynadı!`, ephemeral: true })
                    }
                    return
                case "completed":
                    {

                        let buffer = await ChessboardBuilder.create()
                            .setFen(result.fen)
                            .setHighlight([result.move.from, result.move.to])
                            .setPov(activePuzzle.playerSide)
                            .generateBuffer();

                        await interaction.reply({ files: [buffer], content: `Tebrikler, bulmacayı çözdün!`, ephemeral: true });

                        PuzzleSystem.instance.solvePuzzle(interaction.user.id);

                        return
                    }
                case "invalid":
                    await interaction.reply({ content: `Geçersiz hamle ${enToTr(result.move)}`, ephemeral: true });
                    return;
                case "incorrect":
                    await interaction.reply({ content: `Yanlış hamle ${enToTr(result.move)}`, ephemeral: true });
                    return;
            }
        }
    },
};