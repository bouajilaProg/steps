PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `steps_new` (
	`id` text PRIMARY KEY NOT NULL,
	`workflow_id` text NOT NULL,
	`text` text DEFAULT '' NOT NULL,
	`image_path` text NOT NULL,
	`step_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`workflow_id`) REFERENCES `workflows`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `steps_new` (`id`, `workflow_id`, `text`, `image_path`, `step_order`, `created_at`, `updated_at`)
SELECT `id`, `workflow_id`, `text`, COALESCE(NULLIF(`image_path`, ''), `image_url`) AS `image_path`, `step_order`, `created_at`, `updated_at`
FROM `steps`;
--> statement-breakpoint
DROP TABLE `steps`;
--> statement-breakpoint
ALTER TABLE `steps_new` RENAME TO `steps`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;
