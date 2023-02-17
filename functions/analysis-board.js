const { default: axios } = require("axios");
const { lichess_token } = require("../config.json")

function importGame(pgn){
    const params2 = new URLSearchParams();
    params2.append('pgn',pgn);
    
    axios.post('https://lichess.org/api/import', params2, {headers: { Authorization: "Bearer " + lichess_token }})
    .then(function (response) {
        console.log(response.data.url);
    })
    .catch(function (error) {
        console.log(error);
    });
}