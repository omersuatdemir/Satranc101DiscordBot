module.exports = { getresults };

const { default: axios } = require('axios');
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { discord_token , announcementChannelID, dbConnectionString} = require('../config.json');
const MongoClient = require("mongodb").MongoClient;


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function getresults(t_id){
    axios.get('https://lichess.org/api/tournament/' + t_id + '/results')
    .then(function (response) {

    var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
    var jsondata = JSON.parse(json);

    async function run() {

      checkFirst = false;
      try {
        const client = new MongoClient(dbConnectionString);
        var result1 = await client.db('denemeDB').collection('denemeCol').findOne({ lichessID: jsondata[0].username.toLowerCase() });
        if(result1 != null){
          checkFirst = true;
          console.log(result1.discordID);
        }
        else{
          checkFirst = false;
        }
        await client.close();
      } 
      finally {}

      checkSecond = false;
      try {
        const client = new MongoClient(dbConnectionString);
        var result2 = await client.db('denemeDB').collection('denemeCol').findOne({ lichessID: jsondata[1].username.toLowerCase() });
        if(result2 != null){
          checkSecond = true;
          console.log(result2.discordID);
        }
        else{
          checkSecond = false;
        }
        await client.close();
      } 
      finally {}

      checkThird = false;
      try {
        const client = new MongoClient(dbConnectionString);
        var result3 = await client.db('denemeDB').collection('denemeCol').findOne({ lichessID: jsondata[2].username.toLowerCase() });
        if(result3 != null){
          checkThird = true;
          console.log(result3.discordID);
        }
        else{
          checkThird = false;
        }
        await client.close();
      } 
      finally {}

      client.login(discord_token);

      client.on("ready", ()=>{
        const resultsEmbed = new EmbedBuilder()
        .setColor(0xf9d505)
        .setTitle('🎉 Turnuvamız bitti! Katılan herkese teşekkür ederiz. 🎉')
        .setURL('https://lichess.org/tournament/' + t_id)
        .setDescription(`**🏆Kazananlar🏆**`)
        .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png')
        .addFields(
          { name: `🥇Birinci`, value: (checkFirst ? '<@' + result1.discordID + '>' : 'https://lichess.org/@/' + jsondata[0].username)  }
        )
        .addFields(
          { name: `🥈İkinci`, value: (checkSecond ? '<@' + result2.discordID + '>' : 'https://lichess.org/@/' + jsondata[1].username) }
        )
        .addFields(
          { name: `🥉Üçüncü`, value: (checkThird ? '<@' + result3.discordID + '>' : 'https://lichess.org/@/' + jsondata[2].username) }
        )
        .addFields(
          { name: `Turnuva Linki`, value: 'https://lichess.org/tournament/' + t_id }
        )
        
      client.channels.cache.get(announcementChannelID).send({ embeds: [resultsEmbed] });   
      })
      
      }
      run().catch(console.dir);
    })
    .catch(function (error) {
      console.log(error);
  });
}
