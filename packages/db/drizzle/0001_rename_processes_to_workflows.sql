ALTER TABLE `processes` RENAME TO `workflows`;
--> statement-breakpoint
ALTER TABLE `workflows` RENAME COLUMN `title` TO `name`;
--> statement-breakpoint
ALTER TABLE `steps` RENAME COLUMN `process_id` TO `workflow_id`;
--> statement-breakpoint
ALTER TABLE `steps` RENAME COLUMN `title` TO `text`;
