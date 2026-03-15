CREATE TYPE "public"."customer_type" AS ENUM('External Client', 'ZEP');--> statement-breakpoint
CREATE TABLE "facial_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treatments" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"facial_type_id" integer NOT NULL,
	"order_no" varchar(100) NOT NULL,
	"customer_type" "customer_type" NOT NULL,
	"next_appointment" varchar(255),
	"therapist_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_facial_type_id_facial_types_id_fk" FOREIGN KEY ("facial_type_id") REFERENCES "public"."facial_types"("id") ON DELETE no action ON UPDATE no action;