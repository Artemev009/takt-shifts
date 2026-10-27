CREATE TABLE password_accounts (
  username TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL UNIQUE REFERENCES members(user_id),
  salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT
);
--> statement-breakpoint
CREATE TABLE password_sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES members(user_id),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX password_sessions_user ON password_sessions(user_id);
--> statement-breakpoint
CREATE TABLE password_failures (
  username TEXT PRIMARY KEY NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  blocked_until TEXT
);
