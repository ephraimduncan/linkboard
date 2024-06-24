CREATE TABLE `linkboard_bookmark_collections` (
	`id` text(15) PRIMARY KEY NOT NULL,
	`bookmark_id` text(15) NOT NULL,
	`collection_id` text(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linkboard_bookmark_tags` (
	`id` text(15) PRIMARY KEY NOT NULL,
	`bookmark_id` text(15) NOT NULL,
	`tag_id` text(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linkboard_bookmarks` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` text(15) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`url` text NOT NULL,
	`title` text(255) NOT NULL,
	`description` text(1000),
	`is_public` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linkboard_collections` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` text(15) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(1000),
	`is_public` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linkboard_oauth_accounts` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` text(21) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`provider` text(20) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`expires_at` integer
);
--> statement-breakpoint
CREATE TABLE `linkboard_sessions` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(21) NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linkboard_tags` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` text(15) PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `linkboard_users` (
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`id` text(21) PRIMARY KEY NOT NULL,
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`avatar` text(255),
	`username` text(255),
	`name` text(255)
);
--> statement-breakpoint
CREATE INDEX `bookmark_collection_idx` ON `linkboard_bookmark_collections` (`bookmark_id`,`collection_id`);--> statement-breakpoint
CREATE INDEX `bookmark_tag_idx` ON `linkboard_bookmark_tags` (`bookmark_id`,`tag_id`);--> statement-breakpoint
CREATE INDEX `bookmark_user_idx` ON `linkboard_bookmarks` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookmark_created_at_idx` ON `linkboard_bookmarks` (`created_at`);--> statement-breakpoint
CREATE INDEX `bookmark_url_idx` ON `linkboard_bookmarks` (`url`);--> statement-breakpoint
CREATE INDEX `collection_user_idx` ON `linkboard_collections` (`user_id`);--> statement-breakpoint
CREATE INDEX `collection_name_idx` ON `linkboard_collections` (`name`);--> statement-breakpoint
CREATE INDEX `user_provider_idx` ON `linkboard_oauth_accounts` (`user_id`,`provider`);--> statement-breakpoint
CREATE INDEX `provider_account_idx` ON `linkboard_oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `linkboard_sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `linkboard_tags_name_unique` ON `linkboard_tags` (`name`);--> statement-breakpoint
CREATE INDEX `tag_name_idx` ON `linkboard_tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `linkboard_users_email_unique` ON `linkboard_users` (`email`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `linkboard_users` (`email`);--> statement-breakpoint
CREATE INDEX `user_username_idx` ON `linkboard_users` (`username`);