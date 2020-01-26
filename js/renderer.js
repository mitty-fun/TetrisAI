class Renderer {

    constructor(canvasId, gameInstance, size = 25) {

        const canvas = document.getElementById(canvasId) 
        canvas.width = size * gameInstance.width
        canvas.height = size * gameInstance.height

        this.ctx = canvas.getContext('2d')
        this.size = size
        this.game = gameInstance
    }

    render = () => {

        this._clear()

        this.game.blocks.forEach(this._drawRect)
        this.game.blocks.forEach(this._drawRectStroke)

        this.ctx.scale(0.3, 0.3)
        this.game.nextBlock.block.forEach(this._drawRect)
        this.game.nextBlock.block.forEach(this._drawRectStroke)

        this.ctx.setTransform(1, 0, 0, 1, 0, 0)

        this._drawText()
    }

    _clear = () => {
        this.ctx.fillStyle = '#222222'
        this.ctx.fillRect(0, 0, this.size * 10, this.size * 20)
    }

    _drawRect = (b) => {
        const { size, ctx, game } = this
        ctx.fillStyle = game.status === 'gameover' ? '#666' : b.color
        ctx.fillRect(b.x * size, b.y * size, size, size)
    }

    _drawRectStroke = (b) => {
        const { size, ctx } = this
        ctx.lineWidth = 2
        ctx.strokeStyle = '#111111'
        ctx.beginPath()
        ctx.rect(b.x * size, b.y * size, size, size)
        ctx.stroke()
    }

    _drawText = () => {
        const { size, ctx, game } = this
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'end'
        ctx.font = '20px Comic Sans MS';
        ctx.fillText(game.scores, game.width * size - 10, 25);
    }
}
