import { DateUtil } from './date.util';

describe('DateUtil', () => {
  describe('toISODateString', () => {
    it('should return YYYY-MM-DD format', () => {
      const date = new Date('2026-10-27T15:30:00Z');
      expect(DateUtil.toISODateString(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('calculateAge', () => {
    it('should calculate correct age', () => {
      const today = new Date();
      const dob = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
      expect(DateUtil.calculateAge(dob)).toBe(25);
    });

    it('should return age - 1 if birthday has not passed this year', () => {
      const today = new Date();
      // Birthday is tomorrow — so age should be one less
      const dob = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate() + 1);
      expect(DateUtil.calculateAge(dob)).toBe(24);
    });
  });

  describe('daysBetween', () => {
    it('should return 0 for same date', () => {
      const date = new Date('2026-01-01');
      expect(DateUtil.daysBetween(date, date)).toBe(0);
    });

    it('should return correct number of days', () => {
      const a = new Date('2026-01-01');
      const b = new Date('2026-01-10');
      expect(DateUtil.daysBetween(a, b)).toBe(9);
    });

    it('should be symmetric', () => {
      const a = new Date('2026-03-01');
      const b = new Date('2026-03-15');
      expect(DateUtil.daysBetween(a, b)).toBe(DateUtil.daysBetween(b, a));
    });
  });

  describe('isPast', () => {
    it('should return true for past date', () => {
      expect(DateUtil.isPast(new Date('2000-01-01'))).toBe(true);
    });

    it('should return false for future date', () => {
      expect(DateUtil.isPast(new Date('2099-12-31'))).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for future date', () => {
      expect(DateUtil.isFuture(new Date('2099-12-31'))).toBe(true);
    });

    it('should return false for past date', () => {
      expect(DateUtil.isFuture(new Date('2000-01-01'))).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2026-01-01');
      const result = DateUtil.addDays(date, 10);
      expect(result.getDate()).toBe(11);
      expect(result.getMonth()).toBe(0); // January
    });

    it('should not mutate original date', () => {
      const date = new Date('2026-01-01');
      DateUtil.addDays(date, 5);
      expect(date.getDate()).toBe(1);
    });
  });

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date('2026-01-15');
      const result = DateUtil.addMonths(date, 3);
      expect(result.getMonth()).toBe(3); // April
    });

    it('should cross year boundary', () => {
      const date = new Date('2026-11-01');
      const result = DateUtil.addMonths(date, 3);
      expect(result.getFullYear()).toBe(2027);
      expect(result.getMonth()).toBe(1); // February
    });
  });

  describe('toVietnameseDate', () => {
    it('should format date as Vietnamese string', () => {
      const date = new Date('2026-10-27');
      const result = DateUtil.toVietnameseDate(date);
      expect(result).toContain('tháng');
      expect(result).toContain('2026');
    });
  });

  describe('startOfDay', () => {
    it('should set time to midnight', () => {
      const date = new Date('2026-07-15T14:30:00');
      const start = DateUtil.startOfDay(date);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('should set time to end of day', () => {
      const date = new Date('2026-07-15T08:00:00');
      const end = DateUtil.endOfDay(date);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const a = new Date('2026-05-10T08:00:00');
      const b = new Date('2026-05-10T22:00:00');
      expect(DateUtil.isSameDay(a, b)).toBe(true);
    });

    it('should return false for different days', () => {
      const a = new Date('2026-05-10');
      const b = new Date('2026-05-11');
      expect(DateUtil.isSameDay(a, b)).toBe(false);
    });
  });

  describe('monthsBetween', () => {
    it('should return 0 for same month', () => {
      const a = new Date('2026-06-01');
      const b = new Date('2026-06-30');
      expect(DateUtil.monthsBetween(a, b)).toBe(0);
    });

    it('should return correct months across years', () => {
      const a = new Date('2025-01-01');
      const b = new Date('2026-07-01');
      expect(DateUtil.monthsBetween(a, b)).toBe(18);
    });
  });

  describe('expiresWithinDays', () => {
    it('should return true when expiry is within threshold', () => {
      const soon = DateUtil.addDays(new Date(), 15);
      expect(DateUtil.expiresWithinDays(soon, 30)).toBe(true);
    });

    it('should return false when expiry is beyond threshold', () => {
      const far = DateUtil.addDays(new Date(), 90);
      expect(DateUtil.expiresWithinDays(far, 30)).toBe(false);
    });

    it('should return false for already expired dates', () => {
      const expired = DateUtil.addDays(new Date(), -5);
      expect(DateUtil.expiresWithinDays(expired, 30)).toBe(false);
    });
  });
});
