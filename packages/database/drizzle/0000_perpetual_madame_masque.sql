CREATE TYPE "public"."commission_status" AS ENUM('PENDING', 'ELIGIBLE', 'PAID', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('QUEUED', 'SENDING', 'DELIVERED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('INITIATED', 'AUTHORIZED', 'CAPTURED', 'SETTLED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('PENDING', 'SCHEDULED', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('REQUESTED', 'APPROVED', 'COLLECTED', 'RECEIVED', 'REFUNDED', 'REJECTED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."seller_status" AS ENUM('PENDING', 'VERIFIED', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."store_role" AS ENUM('OWNER');--> statement-breakpoint
CREATE TYPE "public"."store_status" AS ENUM('DRAFT', 'CONFIGURED', 'PUBLISHED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TYPE "public"."address_purpose" AS ENUM('SHIPPING', 'BILLING', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'ARCHIVE', 'LOGIN', 'LOGOUT', 'AUTH_LOGIN_FAILED', 'AUTH_PASSWORD_RESET_REQUESTED', 'AUTH_PASSWORD_CHANGED', 'AUTH_EMAIL_VERIFIED', 'TENANT_RESOLVED', 'TENANT_DENIED', 'PERMISSION_GRANTED', 'PERMISSION_DENIED', 'ADMIN_ACTION');--> statement-breakpoint
CREATE TYPE "public"."audit_severity" AS ENUM('INFO', 'WARN', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."currency_status" AS ENUM('ACTIVE', 'DEPRECATED');--> statement-breakpoint
CREATE TYPE "public"."file_asset_status" AS ENUM('PENDING_UPLOAD', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"owner_user_id" text,
	"label" text,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"region" text,
	"postal_code" text NOT NULL,
	"country_code" text NOT NULL,
	"phone" text,
	"purpose" "address_purpose" DEFAULT 'BOTH' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	CONSTRAINT "addresses_country_code_uppercase_chk" CHECK ("addresses"."country_code" = UPPER("addresses"."country_code"))
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_user_id" text,
	"actor_role" text,
	"action" "audit_action" NOT NULL,
	"severity" "audit_severity" DEFAULT 'INFO' NOT NULL,
	"target_domain" text,
	"target_id" text,
	"correlation_id" text,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"reason" text
);
--> statement-breakpoint
CREATE TABLE "currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"minor_unit_factor" text DEFAULT '100' NOT NULL,
	"status" "currency_status" DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "currencies_code_unique" UNIQUE("code"),
	CONSTRAINT "currencies_code_uppercase_chk" CHECK ("currencies"."code" = UPPER("currencies"."code"))
);
--> statement-breakpoint
CREATE TABLE "file_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bucket" text NOT NULL,
	"object_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"width_px" integer,
	"height_px" integer,
	"owner_domain" text NOT NULL,
	"owner_id" text,
	"status" "file_asset_status" DEFAULT 'PENDING_UPLOAD' NOT NULL,
	"checksum_sha256" text,
	CONSTRAINT "file_assets_object_key_unique" UNIQUE("object_key"),
	CONSTRAINT "file_assets_size_bytes_non_negative_chk" CHECK ("file_assets"."size_bytes" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo" text,
	"banner" text,
	"status" "store_status" DEFAULT 'DRAFT' NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"branding" jsonb DEFAULT '{}'::jsonb,
	"seo" jsonb DEFAULT '{}'::jsonb,
	"owner_id" uuid NOT NULL,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "store_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"role" "store_role" DEFAULT 'OWNER' NOT NULL,
	"invited_at" timestamp with time zone,
	"accepted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'CUSTOMER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_memberships" ADD CONSTRAINT "store_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_memberships" ADD CONSTRAINT "store_memberships_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_account_idx" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "addresses_owner_user_id_idx" ON "addresses" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "addresses_country_code_idx" ON "addresses" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "addresses_postal_code_idx" ON "addresses" USING btree ("postal_code");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_user_id_idx" ON "audit_logs" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_target_idx" ON "audit_logs" USING btree ("target_domain","target_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "currencies_status_idx" ON "currencies" USING btree ("status");--> statement-breakpoint
CREATE INDEX "file_assets_owner_idx" ON "file_assets" USING btree ("owner_domain","owner_id");--> statement-breakpoint
CREATE INDEX "file_assets_status_idx" ON "file_assets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "file_assets_mime_type_idx" ON "file_assets" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "stores_owner_id_idx" ON "stores" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "stores_status_idx" ON "stores" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stores_created_at_idx" ON "stores" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "store_memberships_user_id_idx" ON "store_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "store_memberships_store_id_idx" ON "store_memberships" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "store_memberships_user_store_idx" ON "store_memberships" USING btree ("user_id","store_id");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_email_verified_idx" ON "users" USING btree ("email_verified");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");