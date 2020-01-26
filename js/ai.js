function AI(game, arr = [], deep = 1) {

    if (deep === 1) game.clearAllActions()

    let step, turnStep

    for (turnStep = 0; turnStep < 4; turnStep++) {

        game.moveDownToEnd()
        deep === 1 ? AI(game, arr, 2) : evaluation(game, arr)
        game.undo()

        step = 0
        while (game.moveRight()) {
            step++
            game.moveDownToEnd()
            deep === 1 ? AI(game, arr, 2) : evaluation(game, arr)
            game.undo()
        }
        game.undo(step)

        step = 0
        while (game.moveLeft()) {
            step++
            game.moveDownToEnd()
            deep === 1 ? AI(game, arr, 2) : evaluation(game, arr)
            game.undo()
        }
        game.undo(step)

        if (game.turnRight() === false) break
    }
    game.undo(turnStep)

    if (deep === 1) {
        let best = arr.sort((a, b) => a.score - b.score).pop().actions
        best = best.split('D').pop().split('')
        best.unshift('D')
        return best
    }

    return []
}


function evaluation(game, arr) {

    let score = 0

    for (let x = 0; x < game.width; x++) {
        let cols = game.blocks.filter(b => b.state === 'fixed' && b.x === x)
        if (cols.length === 0) continue
        
        cols.sort((a, b) => a.y - b.y)
        let space = (20 - cols[0].y) - cols.length
        if (space === 0) continue
        
        score -= space*5
        score -= ((20 - cols[0].y) - space)*3
    }

    game.blocks.forEach(b => {
        score -= 20 - b.y
        if (b.x === 0 || b.x === 9) score += 2
        if (b.y === 19) score += 1
    })

    if (game.status === 'gameover') score = -Infinity

    arr.push({
        score: score,
        actions: game.actions.join('')
    })
}