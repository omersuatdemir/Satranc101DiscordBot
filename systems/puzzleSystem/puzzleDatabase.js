const path = require("path");
const readline = require("linebyline");
const { Puzzle } = require("./puzzle");

class PuzzleDatabase {
    loadRandomPuzzle() {
        // temp solution for reading a huge file
        const DATABASE_LENGTH = 1424107;

        let v = new PuzzleDatabase();
        v._data = [];



        return new Promise(resolve => {
            const lbl = readline(path.join(__dirname, "..", "..", "data", "puzzle_db.csv"));

            let rand = parseInt(Math.random() * DATABASE_LENGTH);
            let lineIndex = 0;
            lbl.on("line", line => {

                if (lineIndex === rand) {
                    var values = line.split(",");
                    //PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningFamily,OpeningVariation
                    var p = new Puzzle(values[1], values[2], values[0], parseInt(values[3]));
                    resolve(p);
                }

                lineIndex++;
            });
        });
    }
}
exports.PuzzleDatabase = PuzzleDatabase;
