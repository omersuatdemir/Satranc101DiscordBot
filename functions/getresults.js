module.exports = { getresults };

const { default: axios } = require('axios');
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { discord_token , announcementChannelID} = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function getresults(t_id){
    axios.get('https://lichess.org/api/tournament/' + t_id + '/results')
    .then(function (response) {

        var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
        var jsondata = JSON.parse(json);
        
        client.login(discord_token);

        client.on("ready", ()=>{
          const resultsEmbed = new EmbedBuilder()
          .setColor(0xf9d505)
          .setTitle('🎉 Turnuvamız bitti! Katılan herkese teşekkür ederiz. 🎉')
          .setURL('https://lichess.org/tournament/' + t_id)
          .setDescription(`**🏆Kazananlar🏆**`)
          .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png')
          .addFields(
            { name: `🥇Birinci`, value: 'https://lichess.org/@/' + jsondata[0].username }
          )
          .addFields(
            { name: `🥈İkinci`, value: 'https://lichess.org/@/' + jsondata[1].username }
          )
          .addFields(
            { name: `🥉Üçüncü`, value: 'https://lichess.org/@/' + jsondata[2].username }
          )
          .addFields(
            { name: `Turnuva Linki`, value: 'https://lichess.org/tournament/' + t_id }
          )
        
        client.channels.cache.get(announcementChannelID).send({ embeds: [resultsEmbed] });   
        })
    })
    .catch(function (error) {
      console.log(error);
  });
}



