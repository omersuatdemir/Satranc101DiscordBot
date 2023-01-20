const { default: axios } = require('axios');
const { lichess_token} = require("../config.json");

function pmall(team_id, message){

    /*const params = new URLSearchParams();
    params.append('message',message);

    axios.post('https://lichess.org/team/'+team_id+'/pm-all', params, {headers: { Authorization: "Bearer " + lichess_token }})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });*/

    console.log('Function is in test development mode.');
    console.log('Team ID: ' + team_id);
    console.log('Message: ' + message)
}

pmall('taskn-satranc','Yeni takımımıza davetlisiniz!\nhttps://lichess.org/team/satranc101');