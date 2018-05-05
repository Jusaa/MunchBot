const parsers = require('../parsers.js')

test('converts raids and messages both ways', () => {

    const raid = {
        boss: 'Snorlax',
        time: '12:00',
        gym: 'Lämmittäjät veturimiehineen',
        trainers: ['PokeHunter', 'TrainerNIA']
    }

    const message = {
        content: parsers.raidToMessage(raid)
    }

    expect(parsers.messageToRaid(message)).toEqual(raid)

})

test('parses command from line', () => {

    expect(parsers.parseCommand('!raid Tyra 12:34 some gym')).toBe('raid')
    expect(parsers.parseCommand('!raid ')).toBe('raid')
    expect(parsers.parseCommand('!raid')).toBe('raid')

})

test('parses raid from !raid command', () => {

    let command = '!raid Tyra 12:34 some gym'
    let expected = {
        boss: 'Tyra',
        time: '12:34',
        gym: 'some gym',
        trainers: []
    }
    expect(parsers.parseRaid(command)).toEqual(expected)

})

test('total calculations', () => {

    expect(parsers.calculateTotal([])).toBe(0)
    expect(parsers.calculateTotal(['none'])).toBe(0)
    expect(parsers.calculateTotal(['munchlax +0'])).toBe(1)
    expect(parsers.calculateTotal(['munchlax', 'snorlax'])).toBe(2)
    expect(parsers.calculateTotal(['munchlax+1', 'snorlax +2'])).toBe(5)


})