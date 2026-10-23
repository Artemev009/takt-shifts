CREATE TABLE availability (user_id TEXT NOT NULL REFERENCES members(user_id), work_date TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('available','unavailable')), start INTEGER, end INTEGER, updated_at TEXT NOT NULL, PRIMARY KEY(user_id,work_date));
--> statement-breakpoint
CREATE TABLE time_corrections (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES members(user_id), work_date TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('in','out')), proposed_at TEXT NOT NULL, reason TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')), reviewer_id TEXT, reviewed_at TEXT, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX one_pending_correction ON time_corrections(user_id,work_date,kind) WHERE status='pending';
