ALTER TABLE shifts ADD COLUMN short_review_status TEXT CHECK (short_review_status IN ('accepted','disputed'));
--> statement-breakpoint
ALTER TABLE shifts ADD COLUMN short_review_by TEXT;
--> statement-breakpoint
ALTER TABLE shifts ADD COLUMN short_review_at TEXT;
--> statement-breakpoint
ALTER TABLE shifts ADD COLUMN short_review_note TEXT;
--> statement-breakpoint
CREATE TABLE attendance_codes (work_date TEXT PRIMARY KEY NOT NULL, code_hash TEXT NOT NULL, expires_at TEXT NOT NULL, created_by TEXT NOT NULL, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE attendance_attempts (user_id TEXT NOT NULL, work_date TEXT NOT NULL, failures INTEGER NOT NULL DEFAULT 0, blocked_until TEXT, PRIMARY KEY (user_id,work_date));
--> statement-breakpoint
CREATE TABLE notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL, read_at TEXT);
--> statement-breakpoint
CREATE INDEX notifications_user_time ON notifications(user_id,created_at DESC);
--> statement-breakpoint
CREATE TABLE audit_events (id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id TEXT NOT NULL, target_id TEXT, action TEXT NOT NULL, work_date TEXT, details TEXT, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX audit_events_time ON audit_events(created_at DESC);
