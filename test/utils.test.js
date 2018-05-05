const utils = require('../utils.js')

test('extracts between tokens', () => {

    expect(utils.extractBetween('munchlax is baby snorlax', 'lax ', ' snor')).toBe('is baby')

});