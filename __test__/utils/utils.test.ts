import { calcDateDifferenceMinutes } from '../../src/utils/utils'

describe('Test calcDateDifferenceMinutes function', () => {
    it('Test calcDateDifferenceMinutes function', () => {
        const date1 = new Date()
        const date2 = new Date()
        // add 15 minutes
        date2.setTime(date2.getTime() + (1000 * 60 * 15))
        expect(calcDateDifferenceMinutes(date1, date2)).toBe(15)
    })

    it('Test calcDateDifferenceMinutes function', () => {
        const date1 = new Date()
        const date2 = new Date()
        expect(calcDateDifferenceMinutes(date1, date2)).toBe(0)
    })
})