import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorHandlerUtil } from './error-handler.util';

describe('ErrorHandlerUtil', () => {
  describe('handleDatabaseError', () => {
    it('should throw CONFLICT for Prisma P2002 (unique constraint)', () => {
      expect(() => ErrorHandlerUtil.handleDatabaseError({ code: 'P2002' })).toThrow(HttpException);
      try {
        ErrorHandlerUtil.handleDatabaseError({ code: 'P2002' });
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(e.message).toContain('đã tồn tại');
      }
    });

    it('should throw NOT_FOUND for Prisma P2025', () => {
      try {
        ErrorHandlerUtil.handleDatabaseError({ code: 'P2025' });
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw BAD_REQUEST for Prisma P2003 (foreign key)', () => {
      try {
        ErrorHandlerUtil.handleDatabaseError({ code: 'P2003' });
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for unknown errors', () => {
      try {
        ErrorHandlerUtil.handleDatabaseError({ code: 'UNKNOWN' });
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('handleValidationError', () => {
    it('should throw BAD_REQUEST with formatted errors', () => {
      const errors = [
        { property: 'email', constraints: { isEmail: 'email must be a valid email' } },
        { property: 'password', constraints: { minLength: 'too short' } },
      ];
      try {
        ErrorHandlerUtil.handleValidationError(errors);
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        const response = e.getResponse() as any;
        expect(response.errors).toHaveLength(2);
        expect(response.errors[0].field).toBe('email');
      }
    });
  });

  describe('handleUnauthorizedError', () => {
    it('should throw UNAUTHORIZED with default message', () => {
      try {
        ErrorHandlerUtil.handleUnauthorizedError();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      }
    });

    it('should throw UNAUTHORIZED with custom message', () => {
      try {
        ErrorHandlerUtil.handleUnauthorizedError('Custom message');
      } catch (e) {
        expect(e.message).toBe('Custom message');
      }
    });
  });

  describe('handleForbiddenError', () => {
    it('should throw FORBIDDEN', () => {
      try {
        ErrorHandlerUtil.handleForbiddenError();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('handleNotFoundError', () => {
    it('should throw NOT_FOUND with resource name', () => {
      try {
        ErrorHandlerUtil.handleNotFoundError('User');
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toContain('User');
      }
    });
  });

  describe('handleConflictError', () => {
    it('should throw CONFLICT', () => {
      try {
        ErrorHandlerUtil.handleConflictError();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });
  });

  describe('handleRateLimitError', () => {
    it('should throw TOO_MANY_REQUESTS', () => {
      try {
        ErrorHandlerUtil.handleRateLimitError();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });
  });

  describe('handleBadRequestError', () => {
    it('should throw BAD_REQUEST', () => {
      try {
        ErrorHandlerUtil.handleBadRequestError('Invalid data');
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('Invalid data');
      }
    });
  });

  describe('handleInternalServerError', () => {
    it('should throw INTERNAL_SERVER_ERROR', () => {
      try {
        ErrorHandlerUtil.handleInternalServerError();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('handleServiceUnavailableError', () => {
    it('should throw SERVICE_UNAVAILABLE', () => {
      try {
        ErrorHandlerUtil.handleServiceUnavailableError();
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      }
    });
  });

  describe('logError', () => {
    it('should call console.error without throwing', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = { message: 'test error', stack: 'stack trace', code: 'ERR', status: 500 };
      expect(() => ErrorHandlerUtil.logError(error, 'TestContext')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('createErrorResponse', () => {
    it('should return error response object with timestamp', () => {
      const response = ErrorHandlerUtil.createErrorResponse('Error occurred', HttpStatus.BAD_REQUEST);
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.message).toBe('Error occurred');
      expect(response.timestamp).toBeDefined();
    });

    it('should include details when provided', () => {
      const details = { field: 'email' };
      const response = ErrorHandlerUtil.createErrorResponse('Error', HttpStatus.BAD_REQUEST, details);
      expect(response.details).toEqual(details);
    });

    it('should not include details key when not provided', () => {
      const response = ErrorHandlerUtil.createErrorResponse('Error', HttpStatus.BAD_REQUEST);
      expect(response).not.toHaveProperty('details');
    });
  });
});
