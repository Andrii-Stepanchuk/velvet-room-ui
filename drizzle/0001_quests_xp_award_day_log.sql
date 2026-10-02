CREATE TABLE `day_log` (
	`day` text PRIMARY KEY NOT NULL,
	`scheduled` integer NOT NULL,
	`cleared` integer NOT NULL,
	`finalized_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`stat` text NOT NULL,
	`effort` text NOT NULL,
	`challenge` text NOT NULL,
	`repeat` text NOT NULL,
	`repeat_days` integer DEFAULT 0 NOT NULL,
	`date` text,
	`note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`archived_at` integer
);
--> statement-breakpoint
CREATE TABLE `xp_award` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`day` text NOT NULL,
	`completed_at` integer NOT NULL,
	`stat` text NOT NULL,
	`title_snapshot` text NOT NULL,
	`base_xp` integer NOT NULL,
	`moon_mult` real NOT NULL,
	`dark_hour` integer NOT NULL,
	`full_moon` integer NOT NULL,
	`arcana_id` text NOT NULL,
	`blessing_pct` real NOT NULL,
	`awarded_xp` integer NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quest`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `xp_award_quest_day` ON `xp_award` (`quest_id`,`day`);--> statement-breakpoint
CREATE INDEX `xp_award_day` ON `xp_award` (`day`);--> statement-breakpoint
CREATE INDEX `xp_award_stat` ON `xp_award` (`stat`);