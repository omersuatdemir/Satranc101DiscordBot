# Çalışma Ortamının Kurulumu

### 1. Gerekli Uygulamalar
 
1. Kaynak Kod Düzenleyicisi 
Ben Visual Studio Code kullanıyorum size de tavsiye ederim. GitHub kısmında kolaylıklar sunuyor. [Bağlantıya](https://www.sachinsf.com/how-to-push-the-code-from-vs-code-to-github/) tıklayarak inceleyebilirsiniz.
 
2. Node.js
 Uygulama Node.js üzerinden geliştirileceğinden uygulamanın yüklü olması gerekir.
 Bu [bağlantı](https://nodejs.org/en/) üzerinden 18.13.0 LTS sürümünü indirin.

### 2. Kurulum

1. Repo'yu klonlayın
`git clone https://github.com/omersuatdemir/Satranc101DiscordBot`
 
2. komut satırından klonladığınız klasöre cd atıp, `npm install` çalıştırın

#### Puzzle Veritabanı Kurulumu

Veritabanı data klasörünün içinde zip dosyası olarak geliyor. Tek yapmanız gereken zip'in içindeki dosyayı aynı klasöre çıkarmak.

### 3. Konfigürasyon Dosyası (config.json)

config.json adlı bir dosya oluşturun. Herkese paylaşmak istemediğimiz token'lar gibi verileri burada depolayacağız. .gitignore dosyasında bu dosyanın da ismi mutlaka olmalı. Bu dosya sadece sizde bulunmalı, içindeki bilgiler başkasıyla paylaşılmamalı.

Oluşturduğunuz dosyanın içine aşağıdaki metni yapıştırın. Daha sonra benden alacağınız token'ları gerekli yerlere yerleştirirsiniz.
   ```json
 {
	"discord_token": "DISCORD_TOKEN",
	"lichess_token": "LICHESS_TOKEN",
	"clientId": "CLIENT_ID",
	"guildId": "GUILD_ID",
    "puzzleChannelId": "PUZZLE_CHANNEL_ID",
	"tournamentPermRoleID": "PERMISSION_ROLE_ID",
	"announcementChannelID": "ANNOUNCEMENT_CHANNEL_ID",
	"lichessTeamID": "LICHESS_TEAM_ID",
	"plus2kRoleID": "GIVEN_ROLE_ID",
	"dbConnectionString": "MONGODB_CONNECTION_STRING"
}
```

Dosyamız artık üzerinde çalışılmaya hazır. GitHub bağlantılarını yaptıktan sonra dosyamızın son şekli aşağıdaki gibi olacaktır.

![image](https://user-images.githubusercontent.com/108292163/213273713-257f28c9-2ed4-445a-9e07-d1ff6b5fdd55.png)
