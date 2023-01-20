const ChessImageGenerator = require("chess-image-generator")

let defaultOptions = {
    size:512,
    light: '#dee3e6',
    dark: '#8ca2ad',
    style: 'alpha',
    flipped: false
}

class ChessboardBuilder
{
    constructor()
    {
        this.fen = ""
        this.parsedFen = undefined
        this.options = defaultOptions
        this.highlight = []
        this.pov = "w"
    }
    static create()
    {
        return new ChessboardBuilder()
    }

    setOptions(options)
    {
        this.options = options
        return this
    }

    setHighlight(highlightingSquares){
        this.highlight = highlightingSquares
        return this
    }
    addHighlight(square){
        this.highlight.push(square)
        return this
    }

    setPov(v){
        this.pov = v
        return this
    }

    setFen(fen)
    {
        this.fen = fen
        return this
    }

    async generateBuffer()
    {
        var opt = this.options
        
        opt.flipped = this.pov === "b"
        
        let generator = new ChessImageGenerator(opt)
        generator.highlightSquares(this.highlight)
        await generator.loadFEN(this.fen)
        let buffer = await generator.generateBuffer()

        return buffer
    }
}

module.exports = {
    ChessboardBuilder
}