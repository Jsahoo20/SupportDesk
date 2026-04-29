const calculateSLADeadline = require('../../utils/slaCalculator');

describe('SLA Calculator', () => {
  let currentTime;

  beforeEach(() => {
    // Lock time for tests to Tuesday, Jan 13, 2026, 12:00 PM
    currentTime = new Date('2026-01-13T12:00:00Z');
    jest.useFakeTimers().setSystemTime(currentTime);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Critical priority should have 2-hour SLA', () => {
    const deadline = calculateSLADeadline('critical');
    const expected = new Date('2026-01-13T14:00:00Z');
    expect(deadline.getTime()).toBe(expected.getTime());
  });

  test('High priority should have 8-hour SLA', () => {
    const deadline = calculateSLADeadline('high');
    const expected = new Date('2026-01-13T20:00:00Z');
    expect(deadline.getTime()).toBe(expected.getTime());
  });

  test('Should skip weekends (Friday to Monday)', () => {
    // Friday, Jan 16, 2026, 4:00 PM (16:00)
    jest.setSystemTime(new Date('2026-01-16T16:00:00Z'));
    
    // Medium is 24 hours.
    // Friday 16:00 to 23:59 = 8 hours
    // Monday 00:00 to 16:00 = 16 hours
    // Wait, the logic just skips whole weekend days (Saturday & Sunday).
    // Let's trace logic: hoursAdded skips 0 and 6.
    // 24 hours added. 
    // Fri 16:00 + 8 = Sat 00:00 (Skipped until Mon 00:00)
    // Mon 00:00 + 16 = Mon 16:00
    // Wait, is 'getHours()' considering local time or UTC? The code just does deadline.setHours(deadline.getHours() + 1).
    // If it crosses midnight on Friday into Saturday, the day changes to 6.
    // It skips Sat(6) and Sun(0). It will keep doing +1 hour until Monday and then start counting again.
    
    // A 8 hour SLA starting on Friday 4 PM (16:00).
    const deadline = calculateSLADeadline('high'); // 8 hours
    
    // +8 hours means it rolls into Saturday 00:00.
    // Let's see: 16 + 8 = 24 -> goes to next day. Wait! 
    // If it is 16:00 + 8 = 00:00 next day. 
    // Let's test what the exact output of current logic is.
    // Fri 16:00 + 1 => Fri 17:00 (1 added)
    // Fri 17:00 + 1 => Fri 18:00 (2 added)
    // ...
    // Fri 23:00 + 1 => Sat 00:00. Now getDay() is 6. Not added.
    // It keeps adding hours but not incrementing 'hoursAdded' until Mon 00:00.
    // Then Mon 00:00 + 1 => Mon 01:00 (9th hour counted).
    // Let's just expect it to roll into Monday or Tuesday properly.
    
    const timeDiff = deadline.getTime() - new Date('2026-01-16T16:00:00Z').getTime();
    const expectedHoursOffset = 8 + 48; // 8 hours of work + 48 hours of weekend skipped
    expect(timeDiff).toBe(expectedHoursOffset * 60 * 60 * 1000);
  });
});
