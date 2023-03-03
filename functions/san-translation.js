module.exports = { enToTr, trToEn }

function enToTr(text) {
    var text;

    var trSAN = ['F', 'A', 'Ş', 'V', 'K'];
    var enSAN = ['B', 'N', 'K', 'Q', 'R'];

    for (let index = 0; index < trSAN.length; index++) {
        text = text.replaceAll(enSAN[index], trSAN[index]);
    }
    return text;
}

function trToEn(text) {
    var text;

    var trSAN = ['K', 'F', 'A', 'Ş', 'V'];
    var enSAN = ['R', 'B', 'N', 'K', 'Q'];

    for (let index = 0; index < trSAN.length; index++) {
        text = text.replaceAll(trSAN[index], enSAN[index]);
    }
    return text;
}
