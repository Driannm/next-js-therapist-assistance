ALTER TABLE "off_days" RENAME TO "off_dates";--> statement-breakpoint
ALTER TABLE "off_dates" RENAME COLUMN "day_of_week" TO "date";--> statement-breakpoint
ALTER TABLE "off_dates" DROP CONSTRAINT "off_days_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "user_day_unique";--> statement-breakpoint
ALTER TABLE "off_dates" ADD CONSTRAINT "off_dates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_date_unique" ON "off_dates" USING btree ("user_id","date");