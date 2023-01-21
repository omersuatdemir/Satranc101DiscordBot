const { default: axios } = require("axios");
const { lichess_token } = require("../config.json")

//Create external engine
/*const params = new URLSearchParams();
params.append('name','Stockfish 15');
params.append('maxThreads','8');
params.append('maxHash','2048');
params.append('defaultDepth','24');
params.append('providerSecret','Dee3uwieZei9ahpaici9bee2yahsai0K');
params.append('providerData','string');

axios.post('https://lichess.org/api/external-engine', params, {headers: { Authorization: "Bearer " + lichess_token }})
.then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });*/

//List external engines
/*axios.get('https://lichess.org/api/external-engine',{headers: { Authorization: "Bearer " + lichess_token }})
.then(function (response) {
    console.log(response.data);
});*/

//Delete external engine
/*axios.delete('https://lichess.org/api/external-engine/{id}',{headers: { Authorization: "Bearer " + lichess_token }})
.then(function (response) {
    console.log(response.data);
});*/

function importGame(png){
    const params2 = new URLSearchParams();
    params2.append('pgn',png);
    
    axios.post('https://lichess.org/api/import', params2, {headers: { Authorization: "Bearer " + lichess_token }})
    .then(function (response) {
        console.log(response.data.url);
    })
    .catch(function (error) {
        console.log(error);
    });
}

importGame('1. e4 c6 { B10 Caro-Kann Defense } 2. c3 d5 3. exd5 cxd5 4. d4 Bf5 5. Nf3 e6 6. Bd3 Bxd3 7. Qxd3 Nc6 8. Bf4 Bd6 9. Bxd6 Qxd6 10. Na3 Nf6 11. O-O-O a6 12. Rhe1 O-O 13. Ne5 a5 14. Nb5 Qe7 15. Nxc6 bxc6 16. Na3 c5 17. dxc5 Qxc5 18. f4 Nd7 19. Nc2 Rab8 20. b3 Qb6 21. Re3 a4 22. b4 Nf6 23. g4 Nxg4 24. Rh3 Nf2 25. Qxh7# { White wins by checkmate. } 1-0');

