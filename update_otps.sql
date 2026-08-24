CREATE TABLE IF NOT EXISTS otps (
    user_id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL
);
