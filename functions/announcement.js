module.exports = { announceTourney };
const { pmall } = require("./pmall");

const { default: axios } = require('axios');
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, time } = require('discord.js');
const { discord_token , announcementChannelID} = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function announceTourney(t_id){
    axios.get('https://lichess.org/api/tournament/' + t_id)
    .then(function (response) {
        
        client.login(discord_token);

        client.on("ready", ()=>{

            const hours = parseInt(hourFunc(response.data.secondsToStart));
            const minutes = parseInt(minutesFunc(response.data.secondsToStart));
            var str1;

            if(hours == 0){
                if(minutes == 0){
                    str1 = 'Az Sonra'
                }
                else{
                    str1 = minutes + ' Dakika Sonra';
                }
            }
            else{
                if(minutes == 0){
                    str1 = hours + ' Saat Sonra'
                }
                else{
                    str1 = hours + ' Saat ' + minutes + ' Dakika Sonra';
                }
            }

            const announceEmbed = new EmbedBuilder()
                .setColor(0x1feb10)
                .setTitle('Turnuvamız ' + str1 + ' Başlıyor!')
                .setURL('https://lichess.org/tournament/' + response.data.id)
                .setDescription('Turnuva Adı: ' + response.data.fullName 
                + '\nTurnuva Linki: https://lichess.org/tournament/' + response.data.id
                + '\nTempo: ' + response.data.clock.limit/60 + '+' + response.data.clock.increment)
                .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png')
            client.channels.cache.get(announcementChannelID).send({ embeds: [announceEmbed] });

            pmall('Turnuvamız ' + str1 + ' Başlıyor!\nhttps://lichess.org/tournament/' + response.data.id);
        })
    })
    .catch(function (error) {
      console.log(error);
  });
}

function hourFunc(seconds){
    const result = new Date(seconds * 1000).toISOString().slice(11, 17);
    return result.slice(0,2);
}

function minutesFunc(seconds){
    const result = new Date(seconds * 1000).toISOString().slice(11, 17);
    return result.slice(3,5);
}