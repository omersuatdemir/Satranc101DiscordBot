module.exports = { leaderboard };

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { discord_token, dbConnectionString, mongoDB, mongoCol } = require('../config.json');
const MongoClient = require("mongodb").MongoClient;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function leaderboard(interaction) {

    client.login(discord_token);

    const db_client = new MongoClient(dbConnectionString);

    try {
        const result = await db_client.db(mongoDB).collection(mongoCol)
            .find({ "puzzlePoints": { $exists: true } }).toArray();
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (element.discordID == interaction.user.id) {
                var tensPlace = parseInt((i + 1) / 10);
                var lbText = 'Bulmaca Puanları Skor Tablosu\n\n';

                //user bilgisi alınırken bilgiye ulaşılamayabilir.
                //ileride bu kısımda bir sorun oluşursa buraya bir de o user'ın olup olmadığını kontrol eden bir mekanizma eklenebilir.
                //https://stackoverflow.com/questions/62543408/how-do-i-convert-an-id-to-a-username-discord-js-v12
                for (let j = tensPlace * 10; j < (tensPlace + 1) * 10; j++) {
                    if (result[j] != null) {
                        const user = client.users.fetch(result[j].discordID, { cache: true });
                        if (user != null) {
                            const userTag = `${user?.username}#${user?.discriminator}`;
                            lbText = lbText + (j + ' - ' + userTag + ' - ' + result[j].puzzlePoints + '\n');
                        }
                    }
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('button1_disabled')
                            .setLabel('Skor Tablosunu Göster')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                    );

                interaction.update({ components: [row] });

                client.on("ready", () => {
                    client.channels.cache.get(interaction.channelId)
                        .send('\`\`\`' + lbText + '\`\`\`');
                })
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        db_client.close();
    }
}