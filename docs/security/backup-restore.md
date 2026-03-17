# Backup & Restore Procedures

## Automatic Backups (Supabase)

Supabase provides automatic daily backups on Pro plan and above.

### Verify Backups Are Enabled
1. Go to Supabase Dashboard > Project Settings > Database
2. Under "Backups", verify daily backups are active
3. Check the retention period (Pro plan: 7 days, Team plan: 14 days)

If on the Free plan: **upgrade to Pro** before launch. Free plan has no backups.

### Point-in-Time Recovery (PITR)
Available on Team plan and above. Allows restoring to any point in the last 7-14 days.

## Manual Backup (pg_dump)

For additional safety, run periodic manual backups:

```bash
# Get your database connection string from Supabase Dashboard > Settings > Database
pg_dump "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" \
  --no-owner --no-acl \
  -F c -f "backup-$(date +%Y%m%d).dump"
```

Store backups in a secure location (e.g., encrypted S3 bucket, Google Drive with 2FA).

## Restore Procedure

### From Supabase Dashboard (automatic backup)
1. Go to Supabase Dashboard > Database > Backups
2. Select the backup point you want to restore to
3. Click "Restore" — this replaces the current database
4. **Warning**: This is destructive. All data written after the backup point will be lost.

### From Manual Backup (pg_dump file)
```bash
# Restore to the database (WARNING: destructive)
pg_restore -d "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" \
  --no-owner --no-acl --clean \
  backup-20260316.dump
```

### Test the Restore (quarterly)
1. Create a temporary Supabase project
2. Restore the latest backup to it
3. Verify:
   - [ ] Tables exist with correct schemas
   - [ ] Sample data looks correct
   - [ ] RLS policies are intact
   - [ ] Edge functions can connect and query
4. Delete the temporary project

## Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Verify Supabase auto-backups are active | Monthly | Rebecca |
| Manual pg_dump backup | Weekly | Rebecca |
| Test restore procedure | Quarterly | Rebecca |
