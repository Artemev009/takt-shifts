CREATE TABLE shift_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL REFERENCES members(user_id),
  work_date TEXT NOT NULL,
  volunteer_id TEXT REFERENCES members(user_id),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','claimed','closed','cancelled')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(owner_id,work_date)
);
--> statement-breakpoint
CREATE INDEX shift_offers_work_date ON shift_offers(work_date,status);
