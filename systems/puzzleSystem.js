const { Chess } = require("chess.js")
const { ChessboardBuilder } = require("../utility/chessboardBuilder")

const path = require("path")

const readline = require("linebyline")
const schedule = require("node-schedule")


class Puzzle
{

    constructor(fen, moves, rating = 0)
    {
        this.fen = fen
        this.moves = moves.split(" ")
        this.rating = rating
        this.playerProgress = {}

        var board = new Chess(this.fen)
        board.move(this.moves[0])
        this.playerSide = board.turn()

    }

    getInitialFen()
    {
        var board = new Chess(this.fen)
        board.move(this.moves[0])
        return board.fen()
    }

    getMovesSan()
    {
        var moves = []
        var board = new Chess(this.fen)

        for (var i = 0; i < this.moves.length; i++)
        {
            let move = board.move(this.moves[i])
                moves.push(move.san)
        }

        return moves
    }

    checkSolution(playerId, playerMoveSan)
    {
        let board = new Chess(this.fen)

        let playerAlreadyHasProgress = Object.keys(this.playerProgress).includes(playerId)

        let playedMoves = 0
        let playerMoves = 0

        if (playerAlreadyHasProgress)
        {
            let playerProgress = this.playerProgress[playerId];
            for (var i = 0; i < playerProgress * 2 + 1; i++)
            {
                board.move(this.moves[i])
            }
            playerMoves = playerProgress;
            playedMoves = playerProgress * 2 + 1;
        } else
        {
            board.move(this.moves[playedMoves])
            playedMoves++;
        }


        var expectedMove = this.moves[playedMoves]
        var expectedFrom = expectedMove.substring(0, 2)
        var expectedTo = expectedMove.substring(2, 4)

        var playerMove

        try
        {
            playerMove = board.move(playerMoveSan)
            playedMoves++;
            playerMoves++;
        } catch (e)
        {
            return { status: "invalid", move: playerMoveSan }
        }
        if (playerMove.from !== expectedFrom || playerMove.to !== expectedTo)
        {
            return { status: "incorrect", move: playerMoveSan }
        }


        if (playedMoves == this.moves.length)
        {
            return { status: "completed", fen: board.fen(), move: { "from": playerMove.from, "to": playerMove.to } }
        } else
        {
            let nextMove = board.move(this.moves[playedMoves])
            this.playerProgress[playerId] = playerMoves
            return { status: "progress", opponentMove: { "san": nextMove.san, "from": nextMove.from, "to": nextMove.to }, fen: board.fen() }
        }
    }

    getSolutionFen()
    {
        let board = new Chess(this.fen)
        for (let i = 0; i < this.moves.length; i++)
        {
            var move = this.moves[i]
            board.move(move)
        }
        return board.fen()
    }
}

class PuzzleDatabase
{
    loadRandomPuzzle()
    {
        // temp solution for reading a huge file
        const DATABASE_LENGTH = 3000000

        let v = new PuzzleDatabase()
        v._data = []



        return new Promise(resolve =>
        {
            const lbl = readline(path.join(__dirname, "..", "data", "puzzle_db.csv"))

            let rand = parseInt(Math.random() * DATABASE_LENGTH)
            let lineIndex = 0
            lbl.on("line", line =>
            {

                if (lineIndex === rand)
                {
                    var values = line.split(",")
                    //PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningFamily,OpeningVariation
                    var p = new Puzzle(values[1], values[2], parseInt(values[3]))
                    resolve(p)
                }

                lineIndex++;
            })
        })
    }
}

class PuzzleSystem
{

    static start(client, channelId)
    {
        console.log("Starting Puzzle System")

        let v = new PuzzleSystem()
        v.channelId = channelId
        v.client = client
        v.activePuzzle = undefined
        v._events = {}
        v._database = new PuzzleDatabase()

        PuzzleSystem.instance = v

        console.log("Puzzle System started")
        return v
    }

    schedule(){
        
        let rule = new schedule.RecurrenceRule()
        rule.minute = 0
        rule.hour = new schedule.Range(12, 24)
        rule.tz = "Europe/Istanbul"

        this.scheduleJob = schedule.scheduleJob(rule, ()=>{
            this.startRandomPuzzle()
        })
        console.log(`Started puzzle schedule. Next occurance: ${rule.nextInvocationDate(Date.now())}`)
    }

    _invokeEvent(event, callback)
    {
        callback(this._events[event])
    }

    async startRandomPuzzle()
    {

        this.activePuzzle = await this._database.loadRandomPuzzle();
        let channel = this.client.channels.cache.get(this.channelId)

        var moveFrom = this.activePuzzle.moves[0].substring(0, 2)
        var moveTo = this.activePuzzle.moves[0].substring(2, 4)

        let buffer = await ChessboardBuilder.create()
            .setFen(this.activePuzzle.getInitialFen())
            .setHighlight([moveFrom, moveTo])
            .setPov(this.activePuzzle.playerSide)
            .generateBuffer()

        await channel.send({ files: [buffer], content: `Bulmaca zamanı! Rating: ${this.activePuzzle.rating}` })
    }

    async solvePuzzle(solver)
    {
        let channel = this.client.channels.cache.get(this.channelId)
        let buffer = await ChessboardBuilder.create()
            .setFen(this.activePuzzle.getSolutionFen())
            .setPov(this.activePuzzle.playerSide)
            .generateBuffer()


        channel.send({
            content: `${solver} bulmacayı çözdü! Çözüm: ||${this.activePuzzle.getMovesSan().join(", ")}||`, files: [{
                attachment: buffer,
                name: "SPOILER_FILE.png"
            }]
        })

        this.endPuzzle()
    }

    endPuzzle()
    {
        if (this.hasOngoingPuzzle())
        {
            this.activePuzzle = undefined
        }
    }

    hasOngoingPuzzle()
    {
        return this.activePuzzle !== undefined
    }
}

module.exports = {
    PuzzleSystem,
    Puzzle
}