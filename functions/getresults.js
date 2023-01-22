module.exports = { getresults };

const { default: axios } = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const { discord_token } = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function getresults(t_id){
    axios.get('https://lichess.org/api/tournament/' + t_id + '/results')
    .then(function (response) {

        var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
        var jsondata = JSON.parse(json);
        var msgTxt = jsondata[0].username + '\n' + jsondata[1].username + '\n' + jsondata[2].username;
        client.login(discord_token);

        client.on("ready", ()=>{
          
          client.channels.cache.get('1001118831042887692').send(msgTxt);
        })
    })
    .catch(function (error) {
      console.log(error);
  });
}



