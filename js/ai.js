let bestScore = 0
let bestActions = ''

function AI(game) {
    bestScore = 0
    game.clearAllActions()
    search(game, 2)
    return bestActions
}

function search(game, depth = 2) {

    let step, turnStep
    
    for (turnStep = 0; turnStep < 4; turnStep++) {
        
        game.moveDownToEnd()
        evaluation(game, depth - 1)
        game.undo()

        step = 0
        while (game.moveRight()) {
            step++
            game.moveDownToEnd()
            evaluation(game, depth - 1)
            game.undo()
        }
        game.undo(step)

        step = 0
        while (game.moveLeft()) {
            step++
            game.moveDownToEnd()
            evaluation(game, depth - 1)
            game.undo()
        }
        game.undo(step)

        if (game.turnRight() === false) break
    }

    game.undo(turnStep)
}


function evaluation(game, depth) {

    if (depth > 0) return search(game, depth)

    let score = 0
    let grid = game.getGrid()
    

    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
            score += 20
            if (grid[y][x] == '*') {
                score -= (20 - y)
            } else {
                if (x > 0 && grid[y][x - 1] == '*') score -= 10
                if (x < 9 && grid[y][x + 1] == '*') score -= 10
                if (y > 0 && grid[y - 1][x] == '*') score -= 10
                if (y < 19 && grid[y + 1][x] == '*') score -= 10
            }

        }
    }

    if (score > bestScore) {
        bestScore = score
        bestActions = game.actions.slice() // shallow clone
    }
}