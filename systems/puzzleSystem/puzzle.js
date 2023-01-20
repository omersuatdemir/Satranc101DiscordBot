const { Chess } = require("chess.js");

class Puzzle
{
    constructor(fen, moves, puzzleId, rating = 0)
    {
        this.solved = false;
        this.puzzleId = puzzleId;
        this.fen = fen;
        this.moves = moves.split(" ");
        this.rating = rating;
        this.playerProgress = {};

        var board = new Chess(this.fen);
        board.move(this.moves[0]);
        this.playerSide = board.turn();

    }

    getInitialFen()
    {
        var board = new Chess(this.fen);
        board.move(this.moves[0]);
        return board.fen();
    }

    getMovesSan()
    {
        var moves = [];
        var board = new Chess(this.fen);

        for (var i = 0; i < this.moves.length; i++)
        {
            let move = board.move(this.moves[i]);
            moves.push(move.san);
        }
        const { PuzzleDatabase } = require("./puzzleDatabase");

        return moves;
    }

    getLichessPuzzleLink()
    {
        return `https://lichess.org/training/${this.puzzleId}`;
    }

    checkSolution(playerId, playerMoveSan)
    {
        let board = new Chess(this.fen);

        let playerAlreadyHasProgress = Object.keys(this.playerProgress).includes(playerId);

        let playedMoves = 0;
        let playerMoves = 0;

        if (playerAlreadyHasProgress)
        {
            let playerProgress = this.playerProgress[playerId];
            playerMoves = playerProgress;
            playedMoves = playerProgress * 2 + 1;

            if (playerMoves * 2 == this.moves.length)
            {
                return { status: "alreadySolved" };
            }

            for (var i = 0; i < playerProgress * 2 + 1; i++)
            {
                board.move(this.moves[i]);
            }


        }
        else
        {
            board.move(this.moves[playedMoves]);
            playedMoves++;
        }


        var expectedMove = this.moves[playedMoves];
        var expectedFrom = expectedMove.substring(0, 2);
        var expectedTo = expectedMove.substring(2, 4);

        var playerMove;

        try
        {
            playerMove = board.move(playerMoveSan);
            playedMoves++;
            playerMoves++;
        } catch (e)
        {
            return { status: "invalid", move: playerMoveSan };
        }
        if (playerMove.from !== expectedFrom || playerMove.to !== expectedTo)
        {
            return { status: "incorrect", move: playerMoveSan };
        }


        if (playedMoves == this.moves.length)
        {
            this.playerProgress[playerId] = playerMoves;
            return { status: "completed", fen: board.fen(), move: { "from": playerMove.from, "to": playerMove.to } };
        }
        else
        {
            let nextMove = board.move(this.moves[playedMoves]);
            this.playerProgress[playerId] = playerMoves;
            return { status: "progress", opponentMove: { "san": nextMove.san, "from": nextMove.from, "to": nextMove.to }, fen: board.fen() };
        }
    }

    getSolutionFen()
    {
        let board = new Chess(this.fen);
        for (let i = 0; i < this.moves.length; i++)
        {
            var move = this.moves[i];
            board.move(move);
        }
        return board.fen();
    }
}

exports.Puzzle = Puzzle