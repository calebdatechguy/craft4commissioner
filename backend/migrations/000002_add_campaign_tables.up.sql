CREATE TABLE IF NOT EXISTS "donations" (
  "id" SERIAL PRIMARY KEY,
  "amount" INTEGER NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "street" VARCHAR(255) NOT NULL,
  "city" VARCHAR(100) NOT NULL,
  "state" VARCHAR(2) NOT NULL,
  "zip_code" VARCHAR(20) NOT NULL,
  "employer" VARCHAR(255),
  "occupation" VARCHAR(255),
  "payment_token" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "subject" VARCHAR(50) NOT NULL,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "newsletter_subscriptions" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "first_name" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);
