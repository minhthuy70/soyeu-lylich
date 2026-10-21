#!/bin/bash

# Backup script for PostgreSQL database
# Usage: ./backup.sh

BACKUP_DIR="/opt/backups/soyeulylich"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="soyeulylich_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get database credentials from environment
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5433}
DB_NAME=${DB_NAME:-soyeulylich}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

echo "Starting backup at $(date)"

# Perform backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $BACKUP_DIR/$BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "Backup completed successfully: $BACKUP_DIR/$BACKUP_FILE"
  
  # Compress backup
  gzip $BACKUP_DIR/$BACKUP_FILE
  echo "Backup compressed: $BACKUP_DIR/$BACKUP_FILE.gz"
  
  # Keep only last 7 days of backups
  find $BACKUP_DIR -name "soyeulylich_backup_*.sql.gz" -mtime +7 -delete
  echo "Old backups removed (older than 7 days)"
else
  echo "Backup failed!"
  exit 1
fi

echo "Backup process finished at $(date)"
