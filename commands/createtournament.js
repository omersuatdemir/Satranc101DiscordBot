const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { lichess_token, tournamentPermRoleID, lichessTeamID} = require("../config.json");
const schedule = require('node-schedule');
const ann = require('../functions/announcement');
const res123 = require('../functions/getresults');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createtournament")
    .setDescription("creates a tournament")

    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "The tournament name. Leave empty to get a random Grandmaster name"
        )
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("clocktime")
        .setDescription("Clock initial time in minutes")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("clockincrement")
        .setDescription("Clock increment in seconds")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("minutes")
        .setDescription("How long the tournament lasts, in minutes")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("waitminutes")
        .setDescription(
          "How long to wait before starting the tournament, from now, in minutes")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("startdate")
        .setDescription(
          "MM/DD/YYYY hh:mm:ss , Overrides the waitMinutes setting"
        )
    )

    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(
          "Anything you want to tell players about the tournament"
        )
    ),

  execute(interaction) {

    if (interaction.member.roles.cache.has(tournamentPermRoleID)) {
      var informationMessage;

      const params = new URLSearchParams();

      params.append("conditions.teamMember.teamId", "taskn-satranc");
      params.append("name", interaction.options.getString("name"));
      params.append("clockTime", interaction.options.getString("clocktime"));
      params.append("clockIncrement",interaction.options.getString("clockincrement"));
      params.append("minutes", interaction.options.getString("minutes"));

      if (interaction.options.getString("startdate") == null) {
        params.append("waitMinutes",interaction.options.getString("waitminutes"));

      } else {

        var myDate = interaction.options.getString("startdate");
        var datum = Date.parse(myDate);
        params.append("startDate", datum);
      }

      params.append("description",interaction.options.getString("description"));

      axios.post("https://lichess.org/api/tournament", params, {headers: { Authorization: "Bearer " + lichess_token }})
        .then(function (response) {
          informationMessage =
            "Turnuva Kuruldu!\nTurnuva Adı: " +
            response.data.fullName +
            "\nBağlantı: https://lichess.org/tournament/" +
            response.data.id +
            "\nBaşlangıç: " +
            response.data.startsAt +
            "\nSüre: " +
            response.data.minutes +
            "\nTempo: " +
            response.data.clock.limit / 60 +
            "+" +
            response.data.clock.increment;

          interaction.reply(informationMessage);

          const date1 = new Date(response.data.startsAt - (5*60*1000));
          const job1 = schedule.scheduleJob(date1, function(){
            ann.announceTourney(response.data.id);
          });
          job1.schedule();

          const date2 = new Date(response.data.startsAt + ((response.data.minutes + 1)*60*1000));
          const job2 = schedule.scheduleJob(date2, function() {
            res123.getresults(response.data.id);
          });
          job2.schedule();

        });
    } else {
      interaction.reply("Turnuva kurulamadı, gerekli yetkiye sahip değilsiniz");
    }
  },
};
