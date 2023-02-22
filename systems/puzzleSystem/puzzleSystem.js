const { ChessboardBuilder } = require("../../utility/chessboardBuilder");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require('discord.js');
const { PuzzleDatabase } = require("./puzzleDatabase");
const { dbConnectionString, mongoDB, mongoCol } = require("../../config.json");

const schedule = require("node-schedule");
const scheduleConfig = require("./puzzleScheduleConfig");
const MongoClient = require("mongodb").MongoClient;

class PuzzleSystem
{

    static start(client, channelId)
    {
        console.log("Starting Puzzle System")

        let v = new PuzzleSystem()
        v.channelId = channelId
        v.client = client
        v.activePuzzle = undefined
        v._events = {}
        v._database = new PuzzleDatabase()

        PuzzleSystem.instance = v

        console.log("Puzzle System started")
        return v
    }

    schedule()
    {

        this.scheduleJob = schedule.scheduleJob({ rule: scheduleConfig.getRule() }, () =>
        {
            this.startRandomPuzzle()

            // reschedule for tomorrow

            var tomorrow = new Date(Date.now())
            tomorrow.setHours(0)
            tomorrow.setUTCMinutes(tomorrow.getUTCMinutes() + 3);
            tomorrow.setDate(tomorrow.getDate() + 1);

            console.log(tomorrow)

            schedule.rescheduleJob(this.scheduleJob, { start: tomorrow, rule: scheduleConfig.getRule() });
            console.log(`Rescheduled puzzle system. Next occurance: ${this.scheduleJob.nextInvocation()})`)
        });
        console.log(`Started puzzle schedule. Next occurance: ${this.scheduleJob.nextInvocation()}`)
    }

    async startRandomPuzzle()
    {

        this.activePuzzle = await this._database.loadRandomPuzzle();
        let channel = this.client.channels.cache.get(this.channelId)

        var moveFrom = this.activePuzzle.moves[0].substring(0, 2)
        var moveTo = this.activePuzzle.moves[0].substring(2, 4)

        let buffer = await ChessboardBuilder.create()
            .setFen(this.activePuzzle.getInitialFen())
            .setHighlight([moveFrom, moveTo])
            .setPov(this.activePuzzle.playerSide)
            .generateBuffer()

        await channel.send({ files: [buffer], content: `Bulmaca zamanı! Rating: ||${this.activePuzzle.rating}||` })
    }

    //bir üye bulmacayı çözdüğünde çalışan fonksiyon.
    //üyenin discord id'si parametre ile alınıyor.
    async solvePuzzle(solverId)
    {
        if (!this.activePuzzle.solved)
        {   
            //üyenin id'si üzerinden bulmaca puanlarının olduğu tablo sorgulanıyor.
            var p_points;
            const db_client = new MongoClient(dbConnectionString);

            try {
                const result = await db_client.db(mongoDB).collection(mongoCol).findOne({ discordID: solverId });

                //eğer üyenin bulmaca puanı kaydı yoksa yeni kayıt oluşturuluyor ve az önce çözdüğü bulmaca için 1 puan ekleniyor.
                if(result == null){

                  p_points = 1;
                  const doc = 
                  {
                      discordID: solverId,
                      puzzlePoints: p_points 
                  }

                  await db_client.db(mongoDB).collection(mongoCol).insertOne(doc);

                }else{

                    if (result.puzzlePoints == null) {
                        //üyenin kaydı var ancak bulmaca puanının yoksa bulmaca puanı kayda ekleniyor.
                        p_points = 1;
                        await db_client.db(mongoDB).collection(mongoCol)
                        .updateOne({ discordID: solverId }, {$set: {puzzlePoints: p_points}});
                    } else {
                        //üyenin bulmaca puanı kaydı varsa eski puanın bir fazlası yeni puan olarak değiştiriliyor.
                        p_points = parseInt(result.puzzlePoints) + 1;
                        const updateDoc = 
                        {
                            $set: 
                            {
                                puzzlePoints: p_points
                            },
                        };

                        await db_client.db(mongoDB).collection(mongoCol).updateOne({ discordID: solverId }, updateDoc);
                    }
                }

              } finally {
                await db_client.close();
              }

            let channel = this.client.channels.cache.get(this.channelId)
            let buffer = await ChessboardBuilder.create()
                .setFen(this.activePuzzle.getSolutionFen())
                .setPov(this.activePuzzle.playerSide)
                .generateBuffer();

            //kanala gönderilecek embed mesaj oluşturuluyor.
            var solvedEmbed = new EmbedBuilder()
                .setColor(0x2cee1a)
                .setTitle('Bulmaca Çözüldü!')
                .setURL(this.activePuzzle.getLichessPuzzleLink())
                .setDescription(`<@${solverId}> bulmacayı çözdü!\nToplam bulmaca puanınız: \`${p_points}\``
                + `\nÇözüm: ||${this.activePuzzle.getMovesSan().join(", ")}||\nBulmaca Linki: ${this.activePuzzle.getLichessPuzzleLink()}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

            const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('button1')
					.setLabel('Skor Tablosunu Göster')
					.setStyle(ButtonStyle.Secondary),
			);

            channel.send({embeds: [solvedEmbed], components: [row] });
        }
    }

    endPuzzle()
    {
        if (this.hasOngoingPuzzle())
        {
            this.activePuzzle = undefined
        }
    }

    hasOngoingPuzzle()
    {
        return this.activePuzzle !== undefined
    }
}

module.exports = {
    PuzzleSystem
}