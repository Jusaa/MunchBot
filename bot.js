const Discord = require('discord.js')
const auth = require('./auth.json')
const dateDifference = require('date-difference')
const client = new Discord.Client()
const parsers = require('./parsers.js')
const config = require('./config.json')
const fs = require('fs')

// Reaction numbers as Unicode, reacting with them normally doesn't work
const reaction_numbers = ["\u0030\u20E3", "\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];
const startTime = new Date();

const helpText = fs.readFileSync('help.md', 'utf8')
console.log(helpText)

client.on('ready', () => {
    client.user.setUsername(config.botName);
    console.log(config.botName + ' is ready');
});

// Triggered when message is sent in server
client.on('message', (message) => {

    // Prevent loop from bots own messages
    if (message.author.bot) return;

    // Get command and its arguments
    if (message.content.startsWith('!')) {

        let command = parsers.parseCommand(message.content)

        console.log('Bot received command: ' + command)

        switch (command) {

            // Creating a raid
            case 'tr':

                let raid = parsers.parseRaid(message.content)
                let msg = parsers.raidToMessage(raid)

                message.delete()
                    .catch((e) => {
                        console.log(e)
                    })
                message.channel.send(msg)
                    .then((message) => {
                        return message.react(reaction_numbers[0])
                    })
                    .then((reaction) => {
                        return reaction.message.react(reaction_numbers[1])
                    })
                    .then((reaction) => {
                        return reaction.message.react(reaction_numbers[2])
                    })
                    .then((reaction) => {
                        return reaction.message.react(reaction_numbers[3])
                    })
                    .catch((e) => {
                        console.error(e)
                    })

                break

            // PingPong!
            case 'ping':
                message.channel.send('pong! `' + (new Date().getTime() - message.createdTimestamp) + ' ms`')
                break

            case 'i':
            case 'info':
                message.channel.send(config.botName + ' uptime: ' + dateDifference(startTime, new Date()))
                break

            case 'h':
            case 'help':
                message.channel.send(helpText)
                break
        }
    }
});

function addTrainerToRaid(reaction, user) {

    let raid = parsers.embedMessageToRaid(reaction.message)
    let trainerWithFriends = getNick(reaction, user)
    raid.trainers = removePreviousRegistrations(user.username, raid.trainers)
    raid.trainers.push(trainerWithFriends)

    let message = parsers.raidToEmbedMessage(raid)

    reaction.message.edit(message)

}

function removeTrainerFromRaid(reaction, user) {

    let raid = parsers.embedMessageToRaid(reaction.message)
    //let trainer = getNick(reaction, user)

    //raid.trainers.splice(raid.trainers.indexOf(trainer), 1)
    raid.trainers = removePreviousRegistrations(user.username, raid.trainers)

    let message = parsers.raidToEmbedMessage(raid)

    reaction.message.edit(message)

}

function removePreviousRegistrations(username, trainers) {
    let filteredList = trainers.filter(trainer => !(trainer === username || trainer.startsWith(username + ' +')))
    return filteredList

    if (filteredList.length === 0) {
        return [parsers.NO_TRAINERS]
    } else {
        return filteredList
    }
}

function getCount(reaction) {
    return (reaction_numbers.indexOf(reaction.emoji.name))
}

// Displays trainer name and possible friends in "+2" style
function getNick(reaction, user) {

    let trainer = user.username
    const friends = getCount(reaction) - 1 // user is included in the count
    if (friends > 0) {
        trainer += ' +' + friends
    }
    return trainer
}

function isValidUser(user) {
    return !user.bot
}

function isValidReaction(reaction) {
    // Message is not from MunchBot
    if (reaction.message.author.id !== client.user.id) {
        return false
    }
    // Reaction is not from our own list
    if (!reaction_numbers.includes(reaction.emoji.name)) {
        return false
    }
    return true
}

client.on('messageReactionAdd', (reaction, user) => {
    if (isValidUser(user) && isValidReaction(reaction)) {
        if (getCount(reaction) === 0) {
            removeTrainerFromRaid(reaction, user)
        } else {
            addTrainerToRaid(reaction, user)
        }
    }
})

client.on('messageReactionRemove', (reaction, user) => {
    if (isValidUser(user) && isValidReaction(reaction)) {
        //removeTrainerFromRaid(reaction, user)
    }
})

client.login(auth.token);
