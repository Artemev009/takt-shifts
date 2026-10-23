CREATE TABLE `needs_new` (
  `work_date` text NOT NULL,
  `hour` integer NOT NULL,
  `count` integer NOT NULL CHECK (`hour` BETWEEN 8 AND 19 AND `count` BETWEEN 0 AND 30),
  PRIMARY KEY (`work_date`,`hour`)
);
--> statement-breakpoint
INSERT INTO `needs_new` (`work_date`,`hour`,`count`) SELECT '2026-10-22',`hour`,`count` FROM `needs`;
--> statement-breakpoint
DROP TABLE `needs`;
--> statement-breakpoint
ALTER TABLE `needs_new` RENAME TO `needs`;
--> statement-breakpoint
CREATE TABLE `shifts_new` (
  `user_id` text NOT NULL REFERENCES `members`(`user_id`),
  `work_date` text NOT NULL,
  `start` integer NOT NULL,
  `end` integer NOT NULL,
  `in_at` text,
  `out_at` text,
  PRIMARY KEY (`user_id`,`work_date`)
);
--> statement-breakpoint
INSERT INTO `shifts_new` (`user_id`,`work_date`,`start`,`end`,`in_at`,`out_at`) SELECT `user_id`,'2026-10-22',`start`,`end`,`in_at`,`out_at` FROM `shifts`;
--> statement-breakpoint
DROP TABLE `shifts`;
--> statement-breakpoint
ALTER TABLE `shifts_new` RENAME TO `shifts`;
