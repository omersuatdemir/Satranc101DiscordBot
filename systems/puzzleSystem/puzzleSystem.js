const { ChessboardBuilder } = require("../../utility/chessboardBuilder")


const schedule = require("node-schedule")
const scheduleConfig = require("./puzzleScheduleConfig")
const { PuzzleDatabase } = require("./puzzleDatabase")

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

    schedule()
    {

        this.scheduleJob = schedule.scheduleJob({ rule: scheduleConfig.getRule() }, () =>
        {
            this.startRandomPuzzle()

            // reschedule for tomorrow

            var tomorrow = new Date(Date.now())
            tomorrow.setHours(0)
            tomorrow.setUTCMinutes(tomorrow.getUTCMinutes() + 3);
            tomorrow.setDate(tomorrow.getDate() + 1);

            console.log(tomorrow)

            schedule.rescheduleJob(this.scheduleJob, { start: tomorrow, rule: scheduleConfig.getRule() });
            console.log(`Rescheduled puzzle system. Next occurance: ${this.scheduleJob.nextInvocation()})`)
        });
        console.log(`Started puzzle schedule. Next occurance: ${this.scheduleJob.nextInvocation()}`)
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
        if (!this.activePuzzle.solved)
        {
            let channel = this.client.channels.cache.get(this.channelId)
            let buffer = await ChessboardBuilder.create()
                .setFen(this.activePuzzle.getSolutionFen())
                .setPov(this.activePuzzle.playerSide)
                .generateBuffer()


            // TODO Send solution gif?

            channel.send({
                content: `${solver} bulmacayı çözdü! Çözüm: ||${this.activePuzzle.getMovesSan().join(", ")}||\nBulmaca Linki: ${this.activePuzzle.getLichessPuzzleLink()}`
            });
        }
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
    PuzzleSystem
}