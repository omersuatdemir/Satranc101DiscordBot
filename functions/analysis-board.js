const { default: axios } = require("axios");
const { lichess_token } = require("../config.json")

function importGame(pgn) {
    const params2 = new URLSearchParams();
    params2.append('pgn', pgn);

    axios.post('https://lichess.org/api/import', params2, { headers: { Authorization: "Bearer " + lichess_token } })
        .then(function (response) {
            console.log(response.data.url);
        })
        .catch(function (error) {
            console.log(error);
        });
}

/*importGame(`[Event "Casual Blitz game"]
[Site "https://lichess.org/N6HTWj0h"]
[Date "2023.02.22"]
[White "dogutas"]
[Black "GozlukluKelAdam"]
[Result "1-0"]
[UTCDate "2023.02.22"]
[UTCTime "14:11:44"]
[WhiteElo "1404"]
[BlackElo "1547"]
[Variant "Standard"]
[TimeControl "180+0"]
[ECO "D31"]
[Opening "Queen's Gambit Declined: Queen's Knight Variation"]
[Termination "Normal"]

1. d4 e6 2. c4 d5 3. Nc3 Bb4 4. a3 Bxc3+ 5. bxc3 Nc6 6. cxd5 exd5 7. Nf3 Be6 8. e3 Nf6 9. Bd3 Ne4 10. O-O Nxc3 11. Qb3 Ne4 12. Bxe4 dxe4 13. Qxb7 exf3 14. Qxc6+ Bd7 15. Qe4+ Be6 16. Qxf3 O-O 17. a4 Qg5 18. e4 f5 19. Bxg5 fxe4 20. Qxe4 Rae8 21. Rfe1 Bf7 22. Qb7 Rxe1+ 23. Rxe1 g6 24. Qxc7 Kg7 25. Qe5+ Kg8 26. Bh6 Re8 27. Qg7# 1-0


`);*/