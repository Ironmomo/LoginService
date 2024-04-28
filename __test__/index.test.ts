import { calc } from '../src'

describe('calc', () => {
    test('should return the correct number ', () => {
      expect(calc(1, 2020)).toBe(2021);
    });

  });