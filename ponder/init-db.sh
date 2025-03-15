#!/bin/sh

echo "Waiting for database to be ready..."
sleep 3

# Drop and recreate the ponder schema
echo "Dropping and recreating ponder schema..."
PGPASSWORD=ponder_password psql -h ponder-db -U ponder -d postgres -c 'DROP SCHEMA IF EXISTS ponder CASCADE;'

echo "Schema dropped successfully!"

# Start the Ponder app
exec npm run start 