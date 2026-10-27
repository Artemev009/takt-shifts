-- Временный пароль руководителя должен быть заменён сотрудником после первого входа.
ALTER TABLE password_accounts ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0 CHECK(must_change_password IN (0,1));
--> statement-breakpoint
CREATE INDEX password_sessions_expiry ON password_sessions(expires_at);
