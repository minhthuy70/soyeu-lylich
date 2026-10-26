import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DatabaseHealthService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Database health check
  async getHealthStatus() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Get database stats
      const [userCount, profileCount, projectCount, resumeCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.profile.count(),
        this.prisma.project.count(),
        this.prisma.resume.count(),
      ]);

      return {
        status: 'healthy',
        timestamp: new Date(),
        database: 'connected',
        stats: {
          users: userCount,
          profiles: profileCount,
          projects: projectCount,
          resumes: resumeCount,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  // 2. Get database size (PostgreSQL specific)
  async getDatabaseSize() {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `;

      return {
        databaseSize: result[0]?.size || 'Unknown',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        databaseSize: 'Unknown',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  // 3. Get table sizes
  async getTableSizes() {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      `;

      return {
        tables: result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        tables: [],
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  // 4. Get slow queries (PostgreSQL pg_stat_statements)
  async getSlowQueries() {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          max_time
        FROM pg_stat_statements
        ORDER BY mean_time DESC
        LIMIT 10
      `;

      return {
        queries: result,
        timestamp: new Date(),
      };
    } catch (error) {
      // pg_stat_statements might not be enabled
      return {
        queries: [],
        message: 'Slow query tracking not available',
        timestamp: new Date(),
      };
    }
  }

  // 5. Get active connections
  async getActiveConnections() {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT count(*) as count
        FROM pg_stat_activity
        WHERE state = 'active'
      `;

      return {
        activeConnections: parseInt(result[0]?.count || '0'),
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        activeConnections: 0,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  // 6. Get index usage statistics
  async getIndexUsage() {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_scan as index_scans
        FROM pg_stat_user_indexes
        ORDER BY idx_scan DESC
      `;

      return {
        indexes: result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        indexes: [],
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  // 7. Optimize database (VACUUM ANALYZE)
  async optimizeDatabase() {
    try {
      await this.prisma.$queryRaw`VACUUM ANALYZE`;

      return {
        success: true,
        message: 'Database optimized successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to optimize database',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  // 8. Get database configuration
  async getDatabaseConfig() {
    try {
      const result = await this.prisma.$queryRaw`
        SHOW ALL
      `;

      return {
        config: result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        config: [],
        error: error.message,
        timestamp: new Date(),
      };
    }
  }
}
