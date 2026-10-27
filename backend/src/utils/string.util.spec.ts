import { StringUtil } from './string.util';

describe('StringUtil', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(StringUtil.capitalize('hello')).toBe('Hello');
      expect(StringUtil.capitalize('HELLO')).toBe('Hello');
      expect(StringUtil.capitalize('hELLO')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(StringUtil.capitalize('')).toBe('');
    });

    it('should handle single character string', () => {
      expect(StringUtil.capitalize('a')).toBe('A');
      expect(StringUtil.capitalize('Z')).toBe('Z');
    });
  });

  describe('toTitleCase', () => {
    it('should capitalize each word in a string', () => {
      expect(StringUtil.toTitleCase('hello world')).toBe('Hello World');
      expect(StringUtil.toTitleCase('software engineer resume')).toBe('Software Engineer Resume');
    });

    it('should handle empty string', () => {
      expect(StringUtil.toTitleCase('')).toBe('');
    });
  });

  describe('toSlug', () => {
    it('should convert standard sentence to kebab-case slug', () => {
      expect(StringUtil.toSlug('Hello World')).toBe('hello-world');
      expect(StringUtil.toSlug('Senior Full-Stack Developer!')).toBe('senior-full-stack-developer');
    });

    it('should remove Vietnamese accents and convert to slug', () => {
      const slug = StringUtil.toSlug('Sơ yếu lý lịch lập trình viên');
      expect(slug).toBe('so-yeu-ly-lich-lap-trinh-vien');
    });

    it('should remove consecutive hyphens and trim', () => {
      expect(StringUtil.toSlug('   Multiple   Spaces   -- And Symbols ## ')).toBe('multiple-spaces-and-symbols');
    });
  });

  describe('truncate', () => {
    it('should return the original string if length is within maxLength', () => {
      expect(StringUtil.truncate('Short text', 20)).toBe('Short text');
    });

    it('should truncate and append default ellipsis', () => {
      expect(StringUtil.truncate('This is a very long description', 15)).toBe('This is a ve...');
    });

    it('should truncate with custom ellipsis', () => {
      expect(StringUtil.truncate('This is a very long description', 15, ' [more]')).toBe('This is  [more]');
    });
  });

  describe('maskString', () => {
    it('should mask all except visibleCount characters', () => {
      expect(StringUtil.maskString('secrettoken', 4)).toBe('*******oken');
      expect(StringUtil.maskString('123456789', 3)).toBe('******789');
    });

    it('should return all asterisks if length <= visibleCount', () => {
      expect(StringUtil.maskString('abc', 4)).toBe('***');
      expect(StringUtil.maskString('', 4)).toBe('');
    });
  });

  describe('maskEmail', () => {
    it('should mask standard email address', () => {
      expect(StringUtil.maskEmail('user@example.com')).toBe('us**@example.com');
      expect(StringUtil.maskEmail('john.doe@gmail.com')).toBe('jo******@gmail.com');
    });

    it('should handle short local part', () => {
      expect(StringUtil.maskEmail('a@domain.com')).toBe('a@domain.com');
    });

    it('should return original if not valid email without @', () => {
      expect(StringUtil.maskEmail('plainstring')).toBe('plainstring');
    });
  });

  describe('removeWhitespace', () => {
    it('should remove all spaces and tabs', () => {
      expect(StringUtil.removeWhitespace(' h e l l o \t w o r l d \n ')).toBe('helloworld');
    });
  });

  describe('isBlank', () => {
    it('should return true for null or undefined', () => {
      expect(StringUtil.isBlank(null)).toBe(true);
      expect(StringUtil.isBlank(undefined)).toBe(true);
    });

    it('should return true for whitespace-only strings', () => {
      expect(StringUtil.isBlank('')).toBe(true);
      expect(StringUtil.isBlank('   \t\n  ')).toBe(true);
    });

    it('should return false for non-blank strings', () => {
      expect(StringUtil.isBlank('a')).toBe(false);
      expect(StringUtil.isBlank('  hello  ')).toBe(false);
    });
  });

  describe('generateRandomString', () => {
    it('should generate string with requested length', () => {
      const res = StringUtil.generateRandomString(16);
      expect(res).toHaveLength(16);
      expect(typeof res).toBe('string');
    });

    it('should generate distinct strings', () => {
      const s1 = StringUtil.generateRandomString(12);
      const s2 = StringUtil.generateRandomString(12);
      expect(s1).not.toBe(s2);
    });
  });

  describe('wordCount', () => {
    it('should count words properly', () => {
      expect(StringUtil.wordCount('Hello world from Vietnam')).toBe(4);
      expect(StringUtil.wordCount('   One   two   three   ')).toBe(3);
    });

    it('should return 0 for empty or whitespace strings', () => {
      expect(StringUtil.wordCount('')).toBe(0);
      expect(StringUtil.wordCount('    ')).toBe(0);
    });
  });

  describe('normalizeVietnamese', () => {
    it('should remove Vietnamese accents and map đ/Đ to d/D', () => {
      expect(StringUtil.normalizeVietnamese('Nguyễn Minh Thùy')).toBe('Nguyen Minh Thuy');
      expect(StringUtil.normalizeVietnamese('Đà Nẵng & Đồng Nai')).toBe('Da Nang & Dong Nai');
    });
  });

  describe('formatVND', () => {
    it('should format amount into currency representation', () => {
      const result = StringUtil.formatVND(1500000);
      expect(result).toMatch(/1\.500\.000/);
    });
  });
});
