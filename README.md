# Çalışma Ortamının Kurulumu

### 1. Gerekli Uygulamalar
 
1. Kaynak Kod Düzenleyicisi 
Ben Visual Studio Code kullanıyorum size de tavsiye ederim. GitHub kısmında kolaylıklar sunuyor. [Bağlantıya](https://www.sachinsf.com/how-to-push-the-code-from-vs-code-to-github/) tıklayarak inceleyebilirsiniz.
 
2. Node.js
 Uygulama Node.js üzerinden geliştirileceğinden uygulamanın yüklü olması gerekir.
 Bu [bağlantı](https://nodejs.org/en/) üzerinden 18.13.0 LTS sürümünü indirin.

### 2. Dosya Kurulum

 1. Öncelikle aşağıdaki fotoğraftaki gibi Code>Local>Download ZIP seçeneklerini seçerek dosyayı indirin.
 
 2. Satranc101DiscordBot-master.zip adlı bir zip dosyası inecek. İçinde yine aynı isimle bir klasör olacak. Bu klasörü masaüstünüze (nerede çalışacaksanız oraya) çıkartın. Ve klasörün isminin sonundaki "-master" kısmını silin. Son hali böyle olacak "Satranc101DiscordBot"
 
### 3. Proje Oluşturma

Dosyada terminal (power shell veya komut istemcisi de olur) açın. Daha sonra
`npm init -y` komutunu çalıştırın. Bu işlem dosyada `package.json` ve `package-lock.json` adında iki dosya oluşturmalı.

### 4. Gerekli Paketler

 1. Discord.js
 Yine dosyanın içinde açık olan bir terminalden `npm install discord.js` komutunu çalıştırın. İşlem bittiğinde `node-modules` adlı bir klasör oluşmuş olması gerek.
 
 2. Axios
 Lichess ile etkileşime girerken 3. parti kütüphaneler yerine Rest API kullanacağız dolayısıyla bir http kütüphanesi kullanmamız gerekiyor. Fetch ve Axios kütüphanelerini detaylıca inceledikten sonra Axios kullanmanın daha uygun olacağına karar verdim. Kurmak için yine aynı terminal üzerinden `npm install axios` komutunu çalıştıracağız.
 
 3. Son olarak isterseniz bir yazım denetleyicisi ekleyebilirsiniz. VS Code kullanıyorsanız bunu önermem. Kurulumu bu [bağlantıdan](https://discordjs.guide/preparations/setting-up-a-linter.html) bulabilirsiniz.
 
 Tüm bu paket kurulumları bittikten sonra yüklediğimiz paketleri kontrol etmek için dosyada açılan bir terminale `npm ls` komutunu giriyoruz. Sonuç böyle olmalı `
axios@1.2.2 
discord.js@14.7.1 
eslint@8.31.0` Eğer 3. adımı atladıysanız eslint'i göremezsiniz.

### 5. Konfigürasyon Dosyası (config.json)

config.json adlı bir dosya oluşturun. Herkese paylaşmak istemediğimiz token'lar gibi verileri burada depolayacağız. .gitignore dosyasında bu dosyanın da ismi mutlaka olmalı. Bu dosya sadece sizde bulunmalı, içindeki bilgiler başkasıyla paylaşılmamalı.

Oluşturduğunuz dosyanın içine aşağıdaki metni yapıştırın. Daha sonra benden alacağınız token'ları gerekli yerlere yerleştirirsiniz.
   ```json
 {
    	"discord_token": "YOUR_DISCORD_TOKEN",
    	"lichess_token": "YOUR_LICHESS_TOKEN",
    	"clientId": "CLIENT_ID",
    	"guildId": "GUILD_ID"
    }
```

Dosyamız artık üzerinde çalışılmaya hazır. GitHub bağlantılarını yaptıktan sonra dosyamızın son şekli aşağıdaki gibi olacaktır.
![image](https://user-images.githubusercontent.com/108292163/213273713-257f28c9-2ed4-445a-9e07-d1ff6b5fdd55.png)

