import { ValidationUtil } from './validation.util';

describe('ValidationUtil', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(ValidationUtil.validateEmail('test@example.com')).toBe(true);
      expect(ValidationUtil.validateEmail('user.name+tag@domain.co')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(ValidationUtil.validateEmail('not-an-email')).toBe(false);
      expect(ValidationUtil.validateEmail('@domain.com')).toBe(false);
      expect(ValidationUtil.validateEmail('user@')).toBe(false);
      expect(ValidationUtil.validateEmail('')).toBe(false);
    });
  });

  describe('validateURL', () => {
    it('should return true for valid URLs', () => {
      expect(ValidationUtil.validateURL('https://example.com')).toBe(true);
      expect(ValidationUtil.validateURL('http://sub.domain.org/path?q=1')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(ValidationUtil.validateURL('not-a-url')).toBe(false);
      expect(ValidationUtil.validateURL('')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return true for valid phone numbers', () => {
      expect(ValidationUtil.validatePhoneNumber('+84901234567')).toBe(true);
      expect(ValidationUtil.validatePhoneNumber('0901234567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(ValidationUtil.validatePhoneNumber('abc')).toBe(false);
      expect(ValidationUtil.validatePhoneNumber('')).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('should return true when start <= end', () => {
      const start = new Date('2020-01-01');
      const end = new Date('2024-01-01');
      expect(ValidationUtil.validateDateRange(start, end)).toBe(true);
    });

    it('should return false when start > end', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2020-01-01');
      expect(ValidationUtil.validateDateRange(start, end)).toBe(false);
    });

    it('should return true when start equals end', () => {
      const date = new Date('2023-06-15');
      expect(ValidationUtil.validateDateRange(date, date)).toBe(true);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should return strong for a complex password', () => {
      const result = ValidationUtil.validatePasswordStrength('MyP@ssw0rd!2024');
      expect(result.isStrong).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should return weak for a simple password', () => {
      const result = ValidationUtil.validatePasswordStrength('abc');
      expect(result.isStrong).toBe(false);
      expect(result.score).toBeLessThan(4);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should give suggestions for missing character types', () => {
      const result = ValidationUtil.validatePasswordStrength('alllowercase');
      expect(result.suggestions).toContain('Mật khẩu nên có chữ hoa');
      expect(result.suggestions).toContain('Mật khẩu nên có số');
    });
  });

  describe('validateFileSize', () => {
    it('should return true for file within size limit', () => {
      expect(ValidationUtil.validateFileSize(1024 * 1024, 5)).toBe(true); // 1MB <= 5MB
    });

    it('should return false for file exceeding size limit', () => {
      expect(ValidationUtil.validateFileSize(10 * 1024 * 1024, 5)).toBe(false); // 10MB > 5MB
    });
  });

  describe('validateFileType', () => {
    it('should return true for allowed file type', () => {
      expect(ValidationUtil.validateFileType('photo.jpg', ['.jpg', '.png'])).toBe(true);
      expect(ValidationUtil.validateFileType('doc.PDF', ['.pdf'])).toBe(true);
    });

    it('should return false for disallowed file type', () => {
      expect(ValidationUtil.validateFileType('script.exe', ['.jpg', '.png'])).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace and remove angle brackets', () => {
      expect(ValidationUtil.sanitizeInput('  hello  ')).toBe('hello');
      expect(ValidationUtil.sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    });
  });

  describe('validateMaxStringLength', () => {
    it('should return true when within limit', () => {
      expect(ValidationUtil.validateMaxStringLength('short', 10)).toBe(true);
    });

    it('should return false when over limit', () => {
      expect(ValidationUtil.validateMaxStringLength('toolongstring', 5)).toBe(false);
    });
  });

  describe('validateMinStringLength', () => {
    it('should return true when meets minimum', () => {
      expect(ValidationUtil.validateMinStringLength('hello', 3)).toBe(true);
    });

    it('should return false when below minimum', () => {
      expect(ValidationUtil.validateMinStringLength('ab', 5)).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return true for truthy values', () => {
      expect(ValidationUtil.validateRequired('value')).toBe(true);
      expect(ValidationUtil.validateRequired(0)).toBe(true);
      expect(ValidationUtil.validateRequired(false)).toBe(true);
      expect(ValidationUtil.validateRequired([1, 2])).toBe(true);
    });

    it('should return false for null/undefined/empty', () => {
      expect(ValidationUtil.validateRequired(null)).toBe(false);
      expect(ValidationUtil.validateRequired(undefined)).toBe(false);
      expect(ValidationUtil.validateRequired('')).toBe(false);
      expect(ValidationUtil.validateRequired([])).toBe(false);
    });
  });

  describe('validateNumericRange', () => {
    it('should return true when value is within range', () => {
      expect(ValidationUtil.validateNumericRange(5, 1, 10)).toBe(true);
      expect(ValidationUtil.validateNumericRange(1, 1, 10)).toBe(true);
      expect(ValidationUtil.validateNumericRange(10, 1, 10)).toBe(true);
    });

    it('should return false when value is out of range', () => {
      expect(ValidationUtil.validateNumericRange(0, 1, 10)).toBe(false);
      expect(ValidationUtil.validateNumericRange(11, 1, 10)).toBe(false);
    });
  });

  describe('validateVietnamesePhoneNumber', () => {
    it('should return true for valid Vietnamese phone numbers', () => {
      expect(ValidationUtil.validateVietnamesePhoneNumber('0901234567')).toBe(true);
      expect(ValidationUtil.validateVietnamesePhoneNumber('+84901234567')).toBe(true);
    });

    it('should return false for invalid Vietnamese phone numbers', () => {
      expect(ValidationUtil.validateVietnamesePhoneNumber('1234567890')).toBe(false);
      expect(ValidationUtil.validateVietnamesePhoneNumber('090123456')).toBe(false); // too short
    });
  });

  describe('validateVietnameseID', () => {
    it('should return true for 9-digit ID', () => {
      expect(ValidationUtil.validateVietnameseID('123456789')).toBe(true);
    });

    it('should return true for 12-digit CCCD', () => {
      expect(ValidationUtil.validateVietnameseID('123456789012')).toBe(true);
    });

    it('should return false for invalid ID', () => {
      expect(ValidationUtil.validateVietnameseID('12345')).toBe(false);
      expect(ValidationUtil.validateVietnameseID('abc123456')).toBe(false);
    });
  });
});
