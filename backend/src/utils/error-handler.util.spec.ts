import { HttpException, HttpStatus } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { ErrorHandlerUtil } from './error-handler.util';

function captureHttpException(action: () => never): HttpException {
  try {
    action();
  } catch (error: unknown) {
    if (error instanceof HttpException) {
      return error;
    }
    throw error;
  }

  throw new Error('Expected an HTTP exception');
}

describe('ErrorHandlerUtil', () => {
  describe('handleDatabaseError', () => {
    it('should throw CONFLICT for Prisma P2002 (unique constraint)', () => {
      const error = captureHttpException(() =>
        ErrorHandlerUtil.handleDatabaseError({ code: 'P2002' })
      );

      expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(error.message).toContain('đã tồn tại');
    });

    it('should throw NOT_FOUND for Prisma P2025', () => {
      const error = captureHttpException(() =>
        ErrorHandlerUtil.handleDatabaseError({ code: 'P2025' })
      );

      expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should throw BAD_REQUEST for Prisma P2003 (foreign key)', () => {
      const error = captureHttpException(() =>
        ErrorHandlerUtil.handleDatabaseError({ code: 'P2003' })
      );

      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should throw INTERNAL_SERVER_ERROR for unknown errors', () => {
      const error = captureHttpException(() =>
        ErrorHandlerUtil.handleDatabaseError({ code: 'UNKNOWN' })
      );

      expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('handleValidationError', () => {
    it('should throw BAD_REQUEST with formatted errors', () => {
      const errors: ValidationError[] = [
        { property: 'email', constraints: { isEmail: 'email must be a valid email' } },
        { property: 'password', constraints: { minLength: 'too short' } },
      ];
      const error = captureHttpException(() => ErrorHandlerUtil.handleValidationError(errors));

      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(error.getResponse()).toEqual({
        message: 'Dữ liệu không hợp lệ',
        errors: [
          { field: 'email', message: 'email must be a valid email' },
          { field: 'password', message: 'too short' },
        ],
      });
    });
  });

  describe('handleUnauthorizedError', () => {
    it('should throw UNAUTHORIZED with default message', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleUnauthorizedError());

      expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should throw UNAUTHORIZED with custom message', () => {
      const error = captureHttpException(() =>
        ErrorHandlerUtil.handleUnauthorizedError('Custom message')
      );

      expect(error.message).toBe('Custom message');
    });
  });

  describe('handleForbiddenError', () => {
    it('should throw FORBIDDEN', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleForbiddenError());

      expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('handleNotFoundError', () => {
    it('should throw NOT_FOUND with resource name', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleNotFoundError('User'));

      expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toContain('User');
    });
  });

  describe('handleConflictError', () => {
    it('should throw CONFLICT', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleConflictError());

      expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('handleRateLimitError', () => {
    it('should throw TOO_MANY_REQUESTS', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleRateLimitError());

      expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });
  });

  describe('handleBadRequestError', () => {
    it('should throw BAD_REQUEST', () => {
      const error = captureHttpException(() =>
        ErrorHandlerUtil.handleBadRequestError('Invalid data')
      );

      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Invalid data');
    });
  });

  describe('handleInternalServerError', () => {
    it('should throw INTERNAL_SERVER_ERROR', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleInternalServerError());

      expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('handleServiceUnavailableError', () => {
    it('should throw SERVICE_UNAVAILABLE', () => {
      const error = captureHttpException(() => ErrorHandlerUtil.handleServiceUnavailableError());

      expect(error.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
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
      const response = ErrorHandlerUtil.createErrorResponse(
        'Error occurred',
        HttpStatus.BAD_REQUEST
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.message).toBe('Error occurred');
      expect(response.timestamp).toBeDefined();
    });

    it('should include details when provided', () => {
      const details = { field: 'email' };
      const response = ErrorHandlerUtil.createErrorResponse(
        'Error',
        HttpStatus.BAD_REQUEST,
        details
      );

      expect(response.details).toEqual(details);
    });

    it('should not include details key when not provided', () => {
      const response = ErrorHandlerUtil.createErrorResponse('Error', HttpStatus.BAD_REQUEST);

      expect(response).not.toHaveProperty('details');
    });
  });
});
