export class ValidationUtil {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  }

  static validateDateRange(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
  }

  static validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score += 1;
    else suggestions.push('Mật khẩu phải có ít nhất 8 ký tự');

    if (password.length >= 12) score += 1;
    else suggestions.push('Mật khẩu nên có ít nhất 12 ký tự');

    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Mật khẩu nên có chữ thường');

    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Mật khẩu nên có chữ hoa');

    if (/[0-9]/.test(password)) score += 1;
    else suggestions.push('Mật khẩu nên có số');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else suggestions.push('Mật khẩu nên có ký tự đặc biệt');

    const isStrong = score >= 4;

    return {
      isStrong,
      score,
      suggestions,
    };
  }

  static validateFileSize(fileSize: number, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
  }

  static validateFileType(fileName: string, allowedTypes: string[]): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(`.${extension}`);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static validateMaxStringLength(input: string, maxLength: number): boolean {
    return input.length <= maxLength;
  }

  static validateMinStringLength(input: string, minLength: number): boolean {
    return input.length >= minLength;
  }

  static validateRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  static validateNumericRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static validateAge(dateOfBirth: Date, minAge: number = 18, maxAge: number = 120): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= minAge && age <= maxAge;
  }

  static validateVietnamesePhoneNumber(phone: string): boolean {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  static validateVietnameseID(idNumber: string): boolean {
    // Vietnamese ID numbers are typically 9 or 12 digits
    const idRegex = /^\d{9}$|^\d{12}$/;
    return idRegex.test(idNumber);
  }
}
