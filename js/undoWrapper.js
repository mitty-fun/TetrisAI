function undoWrapper(game) {

    const snapshot = []
    const actions = []

    function undo(i = 1) {
        if (i <= 0) return
        const data = snapshot.splice(0, i).pop()
        if (data) {
            let d = JSON.parse(data)
            game.blocks = d.blocks
            game.scores = d.scores
            game.status = d.status
            game.nextBlock = d.nextBlock
        }
        actions.splice(0, i)
    }

    function decorator(method, action) {
        return function () {
            snapshot.unshift(JSON.stringify({
                blocks: game.blocks,
                scores: game.scores,
                status: game.status,
                nextBlock: game.nextBlock,
            }))
            actions.unshift(action)
            let bool = method.call(game)
            if (bool === false) {
                snapshot.splice(0, 1)
                actions.splice(0, 1)
            }
            return bool
        }
    }

    function clearAllActions() {
        actions.length = 0
        snapshot.length = 0
    }

    game.moveRight = decorator(game.moveRight, 'R')
    game.moveLeft = decorator(game.moveLeft, 'L')
    game.turnRight = decorator(game.turnRight, 'T')
    game.moveDownToEnd = decorator(game.moveDownToEnd, 'D')
    game.snapshot = snapshot
    game.actions = actions
    game.undo = undo
    game.clearAllActions = clearAllActions
    
    return game
}