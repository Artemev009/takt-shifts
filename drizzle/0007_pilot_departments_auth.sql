-- Полный учёт отделов и допусков для сервисного центра 24/7.
ALTER TABLE members ADD COLUMN department TEXT NOT NULL DEFAULT 'mix' CHECK(department IN ('alpha','mix','mail','mess'));
--> statement-breakpoint
ALTER TABLE members ADD COLUMN universal INTEGER NOT NULL DEFAULT 0 CHECK(universal IN (0,1));
--> statement-breakpoint
ALTER TABLE members ADD COLUMN enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1));
--> statement-breakpoint
ALTER TABLE shifts ADD COLUMN department TEXT NOT NULL DEFAULT 'mix' CHECK(department IN ('alpha','mix','mail','mess','night'));
--> statement-breakpoint
CREATE TABLE department_needs (
  work_date TEXT NOT NULL,
  hour INTEGER NOT NULL CHECK(hour BETWEEN 0 AND 23),
  department TEXT NOT NULL CHECK(department IN ('alpha','mix','mail','mess','night')),
  count INTEGER NOT NULL CHECK(count BETWEEN 0 AND 50),
  PRIMARY KEY(work_date,hour,department)
);
--> statement-breakpoint
CREATE INDEX shifts_by_department ON shifts(work_date,department,status);
--> statement-breakpoint
CREATE TABLE password_accounts (
  username TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL UNIQUE REFERENCES members(user_id),
  salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  changed_at TEXT NOT NULL
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
