CREATE TABLE `app_state` (
  `id` integer PRIMARY KEY NOT NULL,
  `payload` text NOT NULL,
  `version` integer DEFAULT 0 NOT NULL,
  CONSTRAINT `app_state_id_check` CHECK (`id` = 1)
);
