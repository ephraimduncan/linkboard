CREATE TABLE `linkboard_user_relationships` (
	`id` text(21) PRIMARY KEY NOT NULL,
	`follower_id` text(21) NOT NULL,
	`followed_id` text(21) NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `follower_idx` ON `linkboard_user_relationships` (`follower_id`);--> statement-breakpoint
CREATE INDEX `followed_idx` ON `linkboard_user_relationships` (`followed_id`);--> statement-breakpoint
CREATE INDEX `unique_relationship` ON `linkboard_user_relationships` (`follower_id`,`followed_id`);