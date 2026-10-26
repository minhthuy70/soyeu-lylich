import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHandlerUtil {
  static handleDatabaseError(error: any): never {
    console.error('Database error:', error);

    if (error.code === 'P2002') {
      throw new HttpException('Dữ liệu đã tồn tại trong hệ thống', HttpStatus.CONFLICT);
    }

    if (error.code === 'P2025') {
      throw new HttpException('Không tìm thấy dữ liệu', HttpStatus.NOT_FOUND);
    }

    if (error.code === 'P2003') {
      throw new HttpException('Dữ liệu tham chiếu không tồn tại', HttpStatus.BAD_REQUEST);
    }

    throw new HttpException('Lỗi cơ sở dữ liệu', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static handleValidationError(errors: any[]): never {
    const formattedErrors = errors.map((err) => ({
      field: err.property,
      message: Object.values(err.constraints).join(', '),
    }));

    throw new HttpException(
      {
        message: 'Dữ liệu không hợp lệ',
        errors: formattedErrors,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  static handleUnauthorizedError(message: string = 'Bạn không có quyền truy cập'): never {
    throw new HttpException(message, HttpStatus.UNAUTHORIZED);
  }

  static handleForbiddenError(
    message: string = 'Bạn không có quyền thực hiện hành động này'
  ): never {
    throw new HttpException(message, HttpStatus.FORBIDDEN);
  }

  static handleNotFoundError(resource: string = 'Dữ liệu'): never {
    throw new HttpException(`Không tìm thấy ${resource}`, HttpStatus.NOT_FOUND);
  }

  static handleConflictError(message: string = 'Dữ liệu đã tồn tại'): never {
    throw new HttpException(message, HttpStatus.CONFLICT);
  }

  static handleRateLimitError(message: string = 'Bạn đã vượt quá giới hạn request'): never {
    throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
  }

  static handleBadRequestError(message: string = 'Yêu cầu không hợp lệ'): never {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  static handleInternalServerError(message: string = 'Lỗi server'): never {
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static handleServiceUnavailableError(message: string = 'Dịch vụ không khả dụng'): never {
    throw new HttpException(message, HttpStatus.SERVICE_UNAVAILABLE);
  }

  static logError(error: any, context?: string): void {
    console.error(`[${context || 'ERROR'}]`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.status,
    });
  }

  static createErrorResponse(message: string, statusCode: HttpStatus, details?: any) {
    return {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    };
  }
}
