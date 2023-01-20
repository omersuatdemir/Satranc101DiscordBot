# Çalışma Ortamının Kurulumu

### 1. Gerekli Uygulamalar
 
1. Kaynak Kod Düzenleyicisi 
Ben Visual Studio Code kullanıyorum size de tavsiye ederim. GitHub kısmında kolaylıklar sunuyor. [Bağlantıya](https://www.sachinsf.com/how-to-push-the-code-from-vs-code-to-github/) tıklayarak inceleyebilirsiniz.
 
2. Node.js
 Uygulama Node.js üzerinden geliştirileceğinden uygulamanın yüklü olması gerekir.
 Bu [bağlantı](https://nodejs.org/en/) üzerinden 18.13.0 LTS sürümünü indirin.

### 2. Kurulum

1. Repo'yu klonlayın
`git clone https://https://github.com/omersuatdemir/Satranc101DiscordBot`
 
2. komut satırından klonladığınız klasöre cd atıp, `npm install` çalıştırın

#### Puzzle Veritabanı Kurulumu

*Bu işlemi otomatikleştiren bir script oluşturulana kadar bu adım uygulanmalı* 

1. Lichess puzzle veritabanını [indirin](https://database.lichess.org/#puzzles)
2. İndirdiğiniz `.zst` uzantılı dosyayı data klasörü içine çıkartın
3. Çıkarttığınız dosyanın adı puzzle_db.csv olmalı

### 3. Konfigürasyon Dosyası (config.json)

config.json adlı bir dosya oluşturun. Herkese paylaşmak istemediğimiz token'lar gibi verileri burada depolayacağız. .gitignore dosyasında bu dosyanın da ismi mutlaka olmalı. Bu dosya sadece sizde bulunmalı, içindeki bilgiler başkasıyla paylaşılmamalı.

Oluşturduğunuz dosyanın içine aşağıdaki metni yapıştırın. Daha sonra benden alacağınız token'ları gerekli yerlere yerleştirirsiniz.
   ```json
 {
    	"discord_token": "YOUR_DISCORD_TOKEN",
    	"lichess_token": "YOUR_LICHESS_TOKEN",
    	"clientId": "CLIENT_ID",
    	"guildId": "GUILD_ID",
		"puzzleChannelId": "PUZZLE_CHANNEL_ID"
    }
```

Dosyamız artık üzerinde çalışılmaya hazır. GitHub bağlantılarını yaptıktan sonra dosyamızın son şekli aşağıdaki gibi olacaktır.

![image](https://user-images.githubusercontent.com/108292163/213273713-257f28c9-2ed4-445a-9e07-d1ff6b5fdd55.png)