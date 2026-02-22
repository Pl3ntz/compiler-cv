CREATE TABLE "cv_education_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"institution" text DEFAULT '' NOT NULL,
	"degree" text DEFAULT '' NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_experience_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_language_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"level" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_project_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"tech" text DEFAULT '' NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_skill_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"values" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cvs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"locale" text NOT NULL,
	"pdf_filename" text,
	"name" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"linkedin" text DEFAULT '' NOT NULL,
	"github" text DEFAULT '' NOT NULL,
	"summary_title" text DEFAULT '' NOT NULL,
	"summary_text" text DEFAULT '' NOT NULL,
	"education_title" text DEFAULT '' NOT NULL,
	"experience_title" text DEFAULT '' NOT NULL,
	"projects_title" text DEFAULT '' NOT NULL,
	"skills_title" text DEFAULT '' NOT NULL,
	"languages_title" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cvs_user_locale_unique" UNIQUE("user_id","locale")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cv_education_items" ADD CONSTRAINT "cv_education_items_cv_id_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_experience_items" ADD CONSTRAINT "cv_experience_items_cv_id_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_language_items" ADD CONSTRAINT "cv_language_items_cv_id_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_project_items" ADD CONSTRAINT "cv_project_items_cv_id_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_skill_categories" ADD CONSTRAINT "cv_skill_categories_cv_id_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cv_education_items_cv_id_idx" ON "cv_education_items" USING btree ("cv_id");--> statement-breakpoint
CREATE INDEX "cv_experience_items_cv_id_idx" ON "cv_experience_items" USING btree ("cv_id");--> statement-breakpoint
CREATE INDEX "cv_language_items_cv_id_idx" ON "cv_language_items" USING btree ("cv_id");--> statement-breakpoint
CREATE INDEX "cv_project_items_cv_id_idx" ON "cv_project_items" USING btree ("cv_id");--> statement-breakpoint
CREATE INDEX "cv_skill_categories_cv_id_idx" ON "cv_skill_categories" USING btree ("cv_id");--> statement-breakpoint
CREATE INDEX "cvs_user_id_idx" ON "cvs" USING btree ("user_id");