module.exports = { pmall };

const { default: axios } = require('axios');
const { lichess_token, lichessTeamID} = require("../config.json");

function pmall(message){

    const params = new URLSearchParams();
    params.append('message',message);

    axios.post('https://lichess.org/team/'+lichessTeamID+'/pm-all', params, {headers: { Authorization: "Bearer " + lichess_token }})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}