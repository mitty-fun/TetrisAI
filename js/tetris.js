const BLOCKS = [
    [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}],
    [{x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}],
    [{x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}],
    [{x: 3, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}],
    [{x: 2, y: 1}, {x: 3, y: 1}, {x: 2, y: 2}, {x: 3, y: 2}],
    [{x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 3, y: 2}],
    [{x: 2, y: 1}, {x: 3, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}],
    
]
const COLORS = ['#db312b', '#569f14', '#1366af', '#fd680b', '#d7b815', '#582479']

class Tetris {

    constructor() {
        this.width = 10
        this.height = 20
        this.blocks = []
        this.posX = undefined
        this.posY = undefined
        this.status = 'playing' // playing, gameover
        this.scores = 0
        this.nextBlock = this.randomBlock()
        this.loadBlocks()
    }

    getGrid () {
        let grid = []
        for (let y = 0; y < this.height; y++) {
            grid[y] = []
            for (let x = 0; x < this.width; x++) {
                grid[y][x] = ' '
            }
        }
        this.blocks.filter(b => b.state === 'fixed').forEach(b => grid[b.y][b.x] = '*')
        return grid
    }

    loadBlocks() {

        if (this.status === 'gameover') return false
        if (this.blocks.some(b => b.state === 'fixed' && b.y <= 2)) {
            return this.status = 'gameover'
        }

        const state = 'moving'
        const color = this.nextBlock.color
        const block = this.nextBlock.block

        this.blocks = this.blocks.concat(block.map(b => {
            return { color, state, x: b.x + 2, y: b.y }
        }))

        this.posX = 4
        this.posY = 2

        this.nextBlock = this.randomBlock()
    }

    randomBlock() {
        const rand1 = Math.floor(Math.random() * BLOCKS.length)
        const rand2 = Math.floor(Math.random() * COLORS.length)
        return {
            block: BLOCKS[rand1],
            color: COLORS[rand2],
        }
    }

    moveDownToEnd() {
        while(this.moveDown()) {}
    }

    moveDown() {
        const bool = this.move(this._moveDown)
        if (bool) this.posY++
        else {
            this.blocks.forEach(b => b.state = 'fixed')
            this.eraseLines()
            this.loadBlocks()
        }
        return bool
    }

    moveRight() {
        const bool = this.move(this._moveRight)
        if (bool) this.posX++
        return bool
    }

    moveLeft() {
        const bool = this.move(this._moveLeft)
        if (bool) this.posX--
        return bool
    }

    turnRight() {
        return this.move(this._turnRight.bind(this))
    }

    move(func) {
        if (this.status === 'gameover') return false
        const fixedBlocks = this.blocks.filter(b => b.state === 'fixed')
        const movingBlocks = this.blocks.filter(b => b.state === 'moving')
        const bool = movingBlocks.every(b => {
            const pos = func(b)
            return this._isValidPos(pos.x, pos.y) && !fixedBlocks.some(target => {
                return target.x == pos.x && target.y == pos.y
            })
        })
        if (bool) {
            movingBlocks.forEach(b => {
                const pos = func(b)
                b.x = pos.x
                b.y = pos.y
            })
        }
        return bool
    }

    eraseLines() {
        for (let y=0; y<this.height; y++) {
            let row = this.blocks.filter(b => b.y === y)
            if (row.length === this.width) {
                this.blocks = this.blocks.filter(b => b.y !== y)
                this.blocks.filter(b => b.y < y).forEach(b => b.y++)
                this.scores++
            }
        }
    }

    _moveDown(b) {
        return { x: b.x, y: b.y + 1 }
    }

    _moveRight(b) {
        return { x: b.x + 1, y: b.y }
    }

    _moveLeft(b) {
        return { x: b.x - 1, y: b.y }
    }

    _turnRight (b) {
        let vx = b.x - this.posX
        let vy = b.y - this.posY
        if (vx*vy !== 0 || vx === 0) vy *= -1
        return {
            x: this.posX + vy,
            y: this.posY + vx,
        }
    }

    _isValidPos(x, y) {
        return y >= 0 && y < this.height &&
               x >= 0 && x < this.width
    }
}
