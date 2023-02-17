class Log {
    constructor() {
    
        this.date = new Date()
        this.txtdate = `${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()}`

    }
    
    async Create(log) {

        const fs = require('fs')
        let data = await `[${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}] ` + log

        
        fs.appendFile(`${this.txtdate}.txt`, data + '\n', (err) => { 
            if (err) throw err;
            console.log('Başarılı bir şekilde veri eklendi')
        })
    }
}
