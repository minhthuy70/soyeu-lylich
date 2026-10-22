#!/bin/bash

# Restore script for PostgreSQL database
# Usage: ./restore.sh <backup-file>

if [ -z "$1" ]; then
  echo "Usage: $0 <backup-file>"
  echo "Example: $0 /opt/backups/soyeulylich/soyeulylich_backup_20240123_120000.sql.gz"
  exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Get database credentials from environment
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5433}
DB_NAME=${DB_NAME:-soyeulylich}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

echo "Starting restore at $(date)"
echo "Backup file: $BACKUP_FILE"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"

# Confirm restore
read -p "This will DROP and RECREATE the database. Are you sure? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
  echo "Decompressing backup file..."
  TEMP_FILE=$(mktemp)
  gunzip -c "$BACKUP_FILE" > $TEMP_FILE
  RESTORE_FILE=$TEMP_FILE
else
  RESTORE_FILE=$BACKUP_FILE
fi

# Perform restore
echo "Restoring database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME < $RESTORE_FILE

if [ $? -eq 0 ]; then
  echo "Restore completed successfully!"
  
  # Clean up temp file
  if [ -n "$TEMP_FILE" ]; then
    rm -f $TEMP_FILE
  fi
else
  echo "Restore failed!"
  
  # Clean up temp file
  if [ -n "$TEMP_FILE" ]; then
    rm -f $TEMP_FILE
  fi
  
  exit 1
fi

echo "Restore process finished at $(date)"
