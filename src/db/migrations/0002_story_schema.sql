CREATE TYPE "public"."story_reaction_type" AS ENUM('like', 'dislike');--> statement-breakpoint
CREATE TABLE "story" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" jsonb NOT NULL,
	"cover_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"story_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_reaction" (
	"story_id" text NOT NULL,
	"user_id" text NOT NULL,
	"reaction" "story_reaction_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_reaction_pk" PRIMARY KEY("story_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "story_save" (
	"story_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_save_pk" PRIMARY KEY("story_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_category_id_story_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."story_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_comment" ADD CONSTRAINT "story_comment_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_comment" ADD CONSTRAINT "story_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_reaction" ADD CONSTRAINT "story_reaction_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_reaction" ADD CONSTRAINT "story_reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_save" ADD CONSTRAINT "story_save_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_save" ADD CONSTRAINT "story_save_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "story_userId_idx" ON "story" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "story_categoryId_idx" ON "story" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "story_createdAt_idx" ON "story" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "story_category_slug_uq" ON "story_category" USING btree ("slug");--> statement-breakpoint
INSERT INTO "story_category" ("id", "name", "slug") VALUES
	('folklore', 'Folklore', 'folklore'),
	('mystery', 'Mystery', 'mystery'),
	('romance', 'Romance', 'romance'),
	('myth', 'Myth', 'myth'),
	('travel', 'Travel', 'travel'),
	('history', 'History', 'history');--> statement-breakpoint
CREATE INDEX "story_comment_storyId_createdAt_idx" ON "story_comment" USING btree ("story_id","created_at");--> statement-breakpoint
CREATE INDEX "story_reaction_storyId_idx" ON "story_reaction" USING btree ("story_id");--> statement-breakpoint
CREATE INDEX "story_reaction_userId_idx" ON "story_reaction" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "story_save_userId_idx" ON "story_save" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "story_save_storyId_idx" ON "story_save" USING btree ("story_id");
