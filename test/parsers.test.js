const parsers = require('../parsers.js')

test('converts both ways', () => {

    const raid = {
        boss: 'Snorlax',
        time: '12:00',
        gym: 'Lämmittäjät veturimiehineen',
        trainers: ['TrainerNIA', 'PokeHunter']
    }

    const message = {
        content: parsers.raidToMessage(raid)
    }

    expect(parsers.messageToRaid(message)).toEqual(raid)

})