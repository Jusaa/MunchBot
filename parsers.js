const utils = require('./utils.js')
const strsplit = require('strsplit')
const TRAINER_SEPARATOR = ', '
const NO_TRAINERS = 'none'

function parseCommand(commandLine) {
    // all commands must start with character '!'
    if (!commandLine.startsWith('!')) {
        return undefined
    }
    // command may have no parameters
    if (commandLine.indexOf(' ') === -1) {
        return commandLine.substring(1)
    }
    // possible parameters are ignored
    return commandLine.substr(1, commandLine.indexOf(' ') - 1)
}

function parseRaid(commandLine) {
    // format is: <command> <boss> <time> <gym>
    // gym name may contain spaces
    let parts = strsplit(commandLine, ' ', 4)
    if (parts.length < 4) {
        throw('invalid raid format')
    }
    return {
        boss: parts[1],
        time: parts[2],
        gym: parts[3],
        trainers: []
    }
}

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
        'TOTAL: ' + calculateTotal(raid.trainers) + '\n' +
        '```'
    return msg
}

function formatTrainerList(trainers) {
    if (trainers.length == 0) {
        return NO_TRAINERS
    }
    return trainers.filter(trainer => trainer !== NO_TRAINERS)
        .sort()
        .join(TRAINER_SEPARATOR)
}

function calculateTotal(trainers) {
    return trainers
        .filter(trainer => trainer !== NO_TRAINERS)
        .reduce((total, trainer) => {
            if (trainer.substr(trainer.length - 2, 1) === '+') {
                return total + 1 + parseInt(trainer.substr(trainer.length - 1), 10)
            } else {
                return total + 1
            }
        }, 0)

}

module.exports = {parseCommand, parseRaid, messageToRaid, raidToMessage, calculateTotal}