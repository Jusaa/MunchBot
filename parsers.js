const utils = require('./utils.js')
const TRAINER_SEPARATOR = ', '

function messageToRaid(message) {
    let body = message.content
    let boss = utils.extractBetween(body, 'Boss: ', '\n')
    let time = utils.extractBetween(body, 'Time: ', '\n')
    let location = utils.extractBetween(body, 'Location: ', '\n')
    let trainers = utils.extractBetween(body, 'Trainers: ', '\n')
    return {
        boss: boss,
        time: time,
        gym: location,
        trainers: trainers.split(TRAINER_SEPARATOR)
    }
}

function raidToMessage(raid) {
    msg = '```' +
        'Boss: ' + raid.boss + '\n' +
        'Time: ' + raid.time + '\n' +
        'Location: ' + raid.gym + '\n' +
        'Trainers: ' + formatTrainerList(raid.trainers) + '\n' +
        'TOTAL: ' + raid.trainers.length + '\n' +
        '```'
    return msg
}

function formatTrainerList(trainers) {
    if (trainers == null || trainers.length == 0) {
        return "none"
    }
    return trainers.sort().join(TRAINER_SEPARATOR)
}


module.exports = {messageToRaid, raidToMessage}