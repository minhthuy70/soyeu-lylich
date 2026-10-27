/**
 * Utility helpers for date operations used throughout the application.
 */
export class DateUtil {
  /**
   * Format a Date to 'YYYY-MM-DD' string.
   */
  static toISODateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculate age in years from a birth date.
   */
  static calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Returns the number of days between two dates (absolute value).
   */
  static daysBetween(dateA: Date, dateB: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.abs(Math.floor((dateA.getTime() - dateB.getTime()) / msPerDay));
  }

  /**
   * Check whether a date is in the past.
   */
  static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check whether a date is in the future.
   */
  static isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Add a given number of days to a date.
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add a given number of months to a date.
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Format a date as a human-readable Vietnamese string, e.g. "27 tháng 10, 2026".
   */
  static toVietnameseDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  }

  /**
   * Returns the start of the day (00:00:00.000) for a given date.
   */
  static startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Returns the end of the day (23:59:59.999) for a given date.
   */
  static endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Returns true if two dates fall on the same calendar day.
   */
  static isSameDay(dateA: Date, dateB: Date): boolean {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  }

  /**
   * Get the number of months between two dates.
   */
  static monthsBetween(start: Date, end: Date): number {
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    return yearDiff * 12 + monthDiff;
  }

  /**
   * Check if a certificate/item expires within a given number of days.
   */
  static expiresWithinDays(expiryDate: Date, days: number): boolean {
    const now = new Date();
    const threshold = DateUtil.addDays(now, days);
    return expiryDate > now && expiryDate <= threshold;
  }
}
