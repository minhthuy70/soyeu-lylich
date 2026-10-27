/**
 * Standard pagination query parameters.
 */
export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}

/**
 * Normalized pagination options ready for database querying (e.g. Prisma `skip` & `take`).
 */
export interface NormalizedPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

/**
 * Standard pagination metadata response.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Utility class for handling pagination logic consistently across controllers and services.
 */
export class PaginationUtil {
  public static readonly DEFAULT_PAGE = 1;
  public static readonly DEFAULT_LIMIT = 10;
  public static readonly MAX_LIMIT = 100;

  /**
   * Normalize raw page and limit values into safe database query offsets.
   */
  static normalize(
    page?: number | string | null,
    limit?: number | string | null,
    defaultLimit: number = PaginationUtil.DEFAULT_LIMIT,
    maxLimit: number = PaginationUtil.MAX_LIMIT
  ): NormalizedPagination {
    const parsedPage = typeof page === 'string' ? parseInt(page, 10) : page;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    const safePage =
      !parsedPage || isNaN(parsedPage) || parsedPage < 1
        ? PaginationUtil.DEFAULT_PAGE
        : Math.floor(parsedPage);

    let safeLimit =
      !parsedLimit || isNaN(parsedLimit) || parsedLimit < 1
        ? defaultLimit
        : Math.floor(parsedLimit);

    if (safeLimit > maxLimit) {
      safeLimit = maxLimit;
    }

    const skip = (safePage - 1) * safeLimit;

    return {
      page: safePage,
      limit: safeLimit,
      skip,
      take: safeLimit,
    };
  }

  /**
   * Build metadata object for paginated responses.
   */
  static buildMeta(total: number, page: number, limit: number): PaginationMeta {
    const safeTotal = Math.max(0, total);
    const safeLimit = Math.max(1, limit);
    const safePage = Math.max(1, page);
    const totalPages = Math.ceil(safeTotal / safeLimit) || 1;

    return {
      total: safeTotal,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1 && safePage <= totalPages + 1,
    };
  }

  /**
   * Wrap an array of items and total count into a standard paginated response.
   */
  static paginate<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
    return {
      data: items,
      meta: PaginationUtil.buildMeta(total, page, limit),
    };
  }

  /**
   * Slice an in-memory array and return a paginated result.
   */
  static paginateArray<T>(
    items: T[],
    page: number = 1,
    limit: number = PaginationUtil.DEFAULT_LIMIT
  ): PaginatedResult<T> {
    const { skip, take, page: safePage, limit: safeLimit } = PaginationUtil.normalize(page, limit);
    const sliced = items.slice(skip, skip + take);
    return PaginationUtil.paginate(sliced, items.length, safePage, safeLimit);
  }
}
