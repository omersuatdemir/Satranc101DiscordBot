module.exports = {enToTr, trToEn}

function enToTr(text){
    var text;
    const trSAN = ['K','F','A','Ş','V'];
    const enSAN = ['R','B','N','K','Q'];
    
    for (let index = 0; index < trSAN.length; index++) {
        text = text.replace(enSAN[index],trSAN[index]);   
    }
    return text;
}

function trToEn(text){
    var text;
    const trSAN = ['K','F','A','Ş','V'];
    const enSAN = ['R','B','N','K','Q'];
    
    for (let index = 0; index < trSAN.length; index++) {
        text = text.replace(trSAN[index],enSAN[index]);   
    }
    return text;
}
