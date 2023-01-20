const { SlashCommandBuilder } = require('discord.js');

const { PuzzleSystem } = require("../systems/puzzleSystem")
const { ChessboardBuilder } = require('../utility/chessboardBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('puzzle')
        .setDescription('Solve the current puzzle!')
        .addStringOption(option =>
            option.setName("move")
                .setDescription("Move to make in SAN format")
                .setRequired(true)),
    async execute(interaction)
    {

        let activePuzzle = PuzzleSystem.instance.activePuzzle

        if (activePuzzle === undefined)
        {
            await interaction.reply("Şuan aktif bir bulmaca bulunmuyor")
        } else
        {
            let move = interaction.options.getString("move")

            var result = activePuzzle.checkSolution(interaction.user.id, move)

            switch (result.status)
            {
                case "progress":
                    {
                        let buffer = await ChessboardBuilder.create()
                            .setFen(result.fen)
                            .setHighlight([result.opponentMove.from, result.opponentMove.to])
                            .setPov(activePuzzle.playerSide)
                            .generateBuffer()

                        await interaction.reply({ files: [buffer], content: `Doğru hamle! Rakibin ${result.opponentMove.san} oynadı!`, ephemeral: true })
                    }
                    return
                case "completed":
                    {

                        let buffer = await ChessboardBuilder.create()
                            .setFen(result.fen)
                            .setHighlight([result.move.from, result.move.to])
                            .setPov(activePuzzle .playerSide)
                            .generateBuffer()

                        await interaction.reply({ files: [buffer], content: `Tebrikler, bulmacayı çözdün!`, ephemeral: true })

                        PuzzleSystem.instance.solvePuzzle(interaction.user)

                        return
                    }
                case "invalid":
                    await interaction.reply({content:`Geçersiz hamle ${result.move}`, ephemeral: true})
                    return
                case "incorrect":
                    await interaction.reply({content: `Yanlış hamle ${result.move}`,ephemeral:true})
                    return
            }
        }
    },
};