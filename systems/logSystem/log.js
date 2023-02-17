class Log {
    constructor() {
        this.fs = require('fs')
        this.path = require('path')
        this.date = new Date()
        this.txtdate = `${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()}`
        this.txttime = `${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}`
    }
    
    async CreateLog(log) {
        let data = await `[${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}] ` + log
        const dirPath = this.path.join(__dirname, 'logs') 
        const filePath = this.path.join(dirPath, `${this.txtdate} ${this.txttime}.txt`)

        if (!this.fs.existsSync(dirPath)) {
            this.fs.mkdirSync(dirPath)
        }
        
        this.fs.appendFile(filePath, data + '\n', (err) => { 
            if (err) throw err;
            console.log('Başarılı bir şekilde veri eklendi')
            
        })
    }

    async CreateErrorLog(errlog) {
        let data = await `[${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}] ` + errlog.stack
        const dirPath = this.path.join(__dirname, 'errorlogs') 
        const filePath = this.path.join(dirPath, `${this.txtdate} ${this.txttime}.txt`)

        if (!this.fs.existsSync(dirPath)) {
            this.fs.mkdirSync(dirPath)
        }
        
        this.fs.appendFile(filePath, data + '\n', (err) => { 
            if (err) throw err;
            console.log('Başarılı bir şekilde veri eklendi')
            this.CreateLog(`Bir hata dosyasi oluşturuldu. DOSYA: ${this.txtdate + " " + this.txttime}.txt`)
        })
    }
}


const log = new Log()

log.CreateErrorLog('Merhaba')