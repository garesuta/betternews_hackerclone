-- First, add the new columns as nullable
ALTER TABLE "comments" ADD COLUMN "content_new" text;
ALTER TABLE "comments" ADD COLUMN "created_at_new" timestamp with time zone;
ALTER TABLE "comments" ADD COLUMN "depth_new" integer;

-- Copy data from old columns to new columns
UPDATE "comments" SET "content_new" = "contet" WHERE "contet" IS NOT NULL;
UPDATE "comments" SET "created_at_new" = "created)_at" WHERE "created)_at" IS NOT NULL;
UPDATE "comments" SET "depth_new" = "dept" WHERE "dept" IS NOT NULL;

-- Set default values for any null values
UPDATE "comments" SET "content_new" = '' WHERE "content_new" IS NULL;
UPDATE "comments" SET "created_at_new" = now() WHERE "created_at_new" IS NULL;
UPDATE "comments" SET "depth_new" = 0 WHERE "depth_new" IS NULL;

-- Make the new columns NOT NULL
ALTER TABLE "comments" ALTER COLUMN "content_new" SET NOT NULL;
ALTER TABLE "comments" ALTER COLUMN "created_at_new" SET NOT NULL;
ALTER TABLE "comments" ALTER COLUMN "depth_new" SET NOT NULL;

-- Drop the old columns
ALTER TABLE "comments" DROP COLUMN "contet";
ALTER TABLE "comments" DROP COLUMN "created)_at";
ALTER TABLE "comments" DROP COLUMN "dept";

-- Rename the new columns to the correct names
ALTER TABLE "comments" RENAME COLUMN "content_new" TO "content";
ALTER TABLE "comments" RENAME COLUMN "created_at_new" TO "created_at";
ALTER TABLE "comments" RENAME COLUMN "depth_new" TO "depth";
