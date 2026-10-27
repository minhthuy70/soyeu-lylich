import { PaginationUtil } from './pagination.util';

describe('PaginationUtil', () => {
  describe('normalize', () => {
    it('should return default values when no args provided', () => {
      const result = PaginationUtil.normalize();
      expect(result).toEqual({
        page: 1,
        limit: 10,
        skip: 0,
        take: 10,
      });
    });

    it('should parse string inputs', () => {
      const result = PaginationUtil.normalize('3', '25');
      expect(result).toEqual({
        page: 3,
        limit: 25,
        skip: 50,
        take: 25,
      });
    });

    it('should fall back to defaults when negative or 0 is passed', () => {
      const result = PaginationUtil.normalize(0, -5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
    });

    it('should fall back to defaults when NaN or invalid string is passed', () => {
      const result = PaginationUtil.normalize('invalid', 'abc');
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should clamp limit to maxLimit', () => {
      const result = PaginationUtil.normalize(1, 500, 10, 50);
      expect(result.limit).toBe(50);
      expect(result.take).toBe(50);
    });

    it('should calculate skip correctly for high page numbers', () => {
      const result = PaginationUtil.normalize(5, 20);
      expect(result.skip).toBe(80);
      expect(result.take).toBe(20);
    });
  });

  describe('buildMeta', () => {
    it('should build correct metadata for empty dataset', () => {
      const meta = PaginationUtil.buildMeta(0, 1, 10);
      expect(meta).toEqual({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('should calculate totalPages accurately with remainder', () => {
      const meta = PaginationUtil.buildMeta(25, 1, 10);
      expect(meta.totalPages).toBe(3);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPreviousPage).toBe(false);
    });

    it('should handle middle page correctly', () => {
      const meta = PaginationUtil.buildMeta(100, 5, 10);
      expect(meta.page).toBe(5);
      expect(meta.totalPages).toBe(10);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPreviousPage).toBe(true);
    });

    it('should handle last page correctly', () => {
      const meta = PaginationUtil.buildMeta(50, 5, 10);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(true);
    });
  });

  describe('paginate', () => {
    it('should wrap data and metadata', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const result = PaginationUtil.paginate(items, 20, 1, 2);

      expect(result.data).toEqual(items);
      expect(result.meta.total).toBe(20);
      expect(result.meta.totalPages).toBe(10);
    });
  });

  describe('paginateArray', () => {
    const list = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    it('should paginate in-memory array correctly on first page', () => {
      const result = PaginationUtil.paginateArray(list, 1, 10);
      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(1);
      expect(result.data[9].id).toBe(10);
      expect(result.meta.total).toBe(25);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(true);
    });

    it('should paginate in-memory array correctly on last partial page', () => {
      const result = PaginationUtil.paginateArray(list, 3, 10);
      expect(result.data).toHaveLength(5);
      expect(result.data[0].id).toBe(21);
      expect(result.data[4].id).toBe(25);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should return empty data array when page is beyond total length', () => {
      const result = PaginationUtil.paginateArray(list, 10, 10);
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(25);
    });
  });
});
