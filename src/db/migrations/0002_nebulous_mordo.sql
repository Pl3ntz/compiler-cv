ALTER TABLE "cvs" DROP CONSTRAINT "cvs_user_locale_unique";--> statement-breakpoint
ALTER TABLE "cvs" ADD COLUMN "title" text DEFAULT '' NOT NULL;