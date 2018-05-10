/**
 * Extract content from target that is between firstToken and secondToken
 */
function extractBetween(target, firstToken, secondToken) {
    let start = target.indexOf(firstToken) + firstToken.length
    let end = target.indexOf(secondToken, start)
    return target.substring(start, end)
}

module.exports = {extractBetween}