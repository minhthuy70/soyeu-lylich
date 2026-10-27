/**
 * String utility helpers used across the SoYeuLyLich application.
 */
export class StringUtil {
  /**
   * Capitalize the first letter of a string.
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convert a string to title case (capitalize each word).
   */
  static toTitleCase(str: string): string {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => StringUtil.capitalize(word))
      .join(' ');
  }

  /**
   * Convert a string to a URL-safe slug.
   * Example: "Hello World!" → "hello-world"
   */
  static toSlug(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Truncate a string to maxLength and append an ellipsis if needed.
   */
  static truncate(str: string, maxLength: number, ellipsis: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
  }

  /**
   * Mask sensitive information, showing only the last `visibleCount` characters.
   * Example: maskString('secrettoken', 4) → '*******oken'
   */
  static maskString(str: string, visibleCount: number = 4): string {
    if (str.length <= visibleCount) return '*'.repeat(str.length);
    return '*'.repeat(str.length - visibleCount) + str.slice(-visibleCount);
  }

  /**
   * Mask an email address for display, e.g. "test@example.com" → "te**@example.com".
   */
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const visibleChars = Math.min(2, local.length);
    const maskedLocal =
      local.slice(0, visibleChars) + '*'.repeat(Math.max(0, local.length - visibleChars));
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Remove all whitespace from a string.
   */
  static removeWhitespace(str: string): string {
    return str.replace(/\s+/g, '');
  }

  /**
   * Check if a string is blank (null, undefined, or only whitespace).
   */
  static isBlank(str: string | null | undefined): boolean {
    return str == null || str.trim().length === 0;
  }

  /**
   * Generate a random alphanumeric string of a given length.
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Count the number of words in a string.
   */
  static wordCount(str: string): number {
    if (StringUtil.isBlank(str)) return 0;
    return str.trim().split(/\s+/).length;
  }

  /**
   * Normalize Vietnamese diacritics to plain ASCII.
   * Useful for case-insensitive search on Vietnamese text.
   */
  static normalizeVietnamese(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  /**
   * Format a number as Vietnamese currency string.
   * Example: 1500000 → "1.500.000 ₫"
   */
  static formatVND(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
}
