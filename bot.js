const Discord = require('discord.js')
const auth = require('./auth.json')
const dateDifference = require('date-difference')
const client = new Discord.Client()
const parsers = require('./parsers.js')
const config = require('./config.json')
const fs = require('fs')
let BOT_ID
let BOT_NAME

// Reaction numbers as Unicode, reacting with them normally doesn't work
//const reaction_numbers = ["\u0030\u20E3", "\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];

// Old all black numbers
//const reaction_numbers = ["Nolla", "1_:438598806825861131", "2_:438599265283997706", "3_:438599716863868928"];

const reaction_numbers = ["Nolla", "1_:463424012194938900", "2_:463424047817162763", "3_:463424065080786944"];

const startTime = new Date();

const helpText = fs.readFileSync('help.md', 'utf8')

client.on('ready', () => {
    client.user.setUsername(config.botName);
    BOT_NAME = config.botName
    BOT_ID = client.user.id
    console.log(BOT_NAME + ' is ready');
});

// Triggered when message is sent in server
client.on('message', (message) => {

    // Prevent loop from bots own messages
    if (message.author.bot) return;

    // Get command and its arguments
    if (message.content.startsWith('!')) {

        let command = parsers.parseCommand(message.content)

        console.log('Bot received command: ' + command)

	let raid
	let msg

        switch (command) {

            // Creating a raid
            case 'r':

                raid = parsers.parseRaid(message.content)
                msg = parsers.raidToEmbedMessage(raid)

                message.delete()
                    .catch((e) => {
                        console.log(e)
                    })
                message.channel.send(msg)
                    .then((message) => {
                        return message.react(reaction_numbers[1])
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

	    case 'xr':

                raid = parsers.parseRaid(message.content)
                msg = parsers.raidToEmbedMessage(raid)

                message.delete()
                    .catch((e) => {
                        console.log(e)
                    })
                message.channel.send(msg)
                    .then((message) => {
                        return message.react(reaction_numbers[1])
                    })
                    .then((reaction) => {
                        return reaction.message.react(reaction_numbers[2])
                    })
                    .then((reaction) => {
                        return reaction.message.react(reaction_numbers[3])
                    })
		    .then((reaction) => {
			return reaction.message.pin()
		    })
                    .catch((e) => {
                        console.error(e)
                    })

                break

            // PingPong!
            case 'ping':
                message.channel.send('pong! `' + (new Date().getTime() - message.createdTimestamp) + ' ms`')
                break

            // bot info
            case 'i':
            case 'info':
                message.channel.send(config.botName + ' uptime: ' + dateDifference(startTime, new Date()))
                break

            // bot help
            case 'bh':
            case 'bhelp':
            case 'bothelp':
                message.channel.send(helpText)
                break
        }
    }
});

function updateRaidMessage(reaction, user) {

    let raid = parsers.embedMessageToRaid(reaction.message)
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

exports.getPeopleCount = getPeopleCount = (reaction) => {
    return (reaction_numbers.indexOf(reaction.emoji.name + ":" + reaction.emoji.id))
}

// Displays trainer name and possible friends in "+2" style
function getNick(reaction, user) {

    let trainer = user.username
    const friends = getPeopleCount(reaction) - 1 // user is included in the count
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
    if (!reaction_numbers.includes(reaction.emoji.name + ":" + reaction.emoji.id)) {
        return false
    }
    return true
}

exports.getBotId = getBotId = () => {
    return BOT_ID
}

client.on('messageReactionAdd', (reaction, user) => {
    if (isValidUser(user) && isValidReaction(reaction)) {
        updateRaidMessage(reaction, user)
    }
})

client.on('messageReactionRemove', (reaction, user) => {
    if (isValidUser(user) && isValidReaction(reaction)) {
        updateRaidMessage(reaction, user)
    }
})

client.login(auth.token);
