ALTER TABLE `shifts` ADD COLUMN `status` text NOT NULL DEFAULT 'approved' CHECK (`status` IN ('pending','approved','rejected'));
