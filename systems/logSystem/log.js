/*class LogSystem {

    fs = require('fs');
    path = require('path');
    
    async CreateLog(log) {
        const date = Date.now();
        const txtdate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const txttime = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        
        const data = await `[${txttime}] ` + log;
        const dirPath = path.join(__dirname, 'logs');
        const filePath = path.join(dirPath, `${txtdate} ${txttime}.txt`);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        
        fs.appendFile(filePath, data + '\n', (err) => { 
            if (err) throw err;            
        })
    }

    async CreateErrorLog(errlog) {
        const date = Date.now();
        const txtdate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const txttime = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        const data = await `[${txttime}] ` + errlog.stack;
        const dirPath = path.join(__dirname, 'errorlogs');
        const filePath = path.join(dirPath, `${txtdate} ${txttime}.txt`);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }
        
        fs.appendFile(filePath, data + '\n', (err) => { 
            if (err) throw err;
            CreateLog(`Bir hata dosyasi oluşturuldu. DOSYA: ${txtdate + " " + txttime}.txt`);
        })
    }
}

module.exports = {LogSystem};*/