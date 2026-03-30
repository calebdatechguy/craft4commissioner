import { pgTable, serial, varchar, integer, timestamp, text, jsonb, bigint, boolean, unique, uuid, foreignKey, customType } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tsvector = customType<{
data: string;
}>({
dataType() {
  return 'tsvector';
},
});

export const usersTable = pgTable("users_table", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
});

export const donations = pgTable("donations", {
	id: serial().primaryKey().notNull(),
	amount: integer().notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 50 }),
	street: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 100 }).notNull(),
	state: varchar({ length: 2 }).notNull(),
	zipCode: varchar("zip_code", { length: 20 }).notNull(),
	employer: varchar({ length: 255 }),
	occupation: varchar({ length: 255 }),
	paymentToken: varchar("payment_token", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 50 }),
	subject: varchar({ length: 50 }).notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const candidateProfile = pgTable("candidate_profile", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	district: varchar({ length: 255 }).notNull(),
	slogan: varchar({ length: 255 }).notNull(),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
	bioSummary: text("bio_summary").notNull(),
	bioHistoryYears: integer("bio_history_years").notNull(),
	bioResidencyYears: integer("bio_residency_years").notNull(),
	bioBackground: text("bio_background").notNull(),
	bioFamilyInfo: text("bio_family_info").notNull(),
	bioJobDescription: text("bio_job_description").notNull(),
	values: jsonb().notNull(),
});

export const campaignPriorities = pgTable("campaign_priorities", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	category: varchar({ length: 50 }).notNull(),
});

export const schemaMigrations = pgTable("schema_migrations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	version: bigint({ mode: "number" }).primaryKey().notNull(),
	dirty: boolean().notNull(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastName: varchar("last_name", { length: 255 }),
}, (table) => [
	unique("newsletter_subscriptions_email_key").on(table.email),
]);

export const heroSection = pgTable("hero_section", {
	id: serial().primaryKey().notNull(),
	headline: varchar({ length: 255 }).notNull(),
	subheadline: varchar({ length: 255 }),
	ctaText: varchar("cta_text", { length: 255 }),
	heroImageUrl: varchar("hero_image_url", { length: 255 }).notNull(),
	heroImageAltText: varchar("hero_image_alt_text", { length: 255 }).notNull(),
	maxWidth: varchar("max_width", { length: 50 }).notNull(),
	maxHeight: varchar("max_height", { length: 50 }).notNull(),
	objectFit: varchar("object_fit", { length: 50 }).notNull(),
	ctaUrl: varchar("cta_url", { length: 255 }),
});

export const donationLeads = pgTable("donation_leads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	expectedAmount: integer("expected_amount").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
});

export const adminUsers = pgTable("admin_users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("admin_users_username_key").on(table.username),
]);

export const sessions = pgTable("sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
]);
