CREATE TABLE `members` (
  `user_id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `role` text NOT NULL CHECK (`role` IN ('manager','employee'))
);
--> statement-breakpoint
CREATE TABLE `needs` (
  `hour` integer PRIMARY KEY NOT NULL,
  `count` integer NOT NULL CHECK (`hour` BETWEEN 8 AND 19 AND `count` BETWEEN 0 AND 30)
);
--> statement-breakpoint
CREATE TABLE `shifts` (
  `user_id` text PRIMARY KEY NOT NULL REFERENCES `members`(`user_id`),
  `start` integer NOT NULL,
  `end` integer NOT NULL,
  `in_at` text,
  `out_at` text
);
--> statement-breakpoint
CREATE TABLE `activity` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `message` text NOT NULL,
  `created_at` text NOT NULL
);
