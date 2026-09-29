import pg from "pg";
import { env } from "./env.js";
const { Pool } = pg;

if (!env.databaseUrl) {
  console.error(
    "x DATABASE_URL is not set. Add your Neon connection string to .env",
  );
}

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
});
export function query(text, params) {
  return pool.query(text, params);

  pool.on("error", (err) => {
    console.error("A Postgres pool error:", err.message);
  });
}



export async function migrate() {
  // Enable UUID generation
  await query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);

  // =========================
  // USERS TABLE
  // =========================

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      name TEXT NOT NULL,

      email TEXT UNIQUE NOT NULL,

      password TEXT NOT NULL,

      avatar_color TEXT NOT NULL DEFAULT '#0c8b7c',

      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // =========================
  // FORMS TABLE
  // =========================

  await query(`
    CREATE TABLE IF NOT EXISTS forms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      owner UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      title TEXT NOT NULL DEFAULT 'Untitled form',

      description TEXT NOT NULL DEFAULT '',

      theme TEXT NOT NULL DEFAULT 'modern',

      status TEXT NOT NULL DEFAULT 'draft',

      slug TEXT UNIQUE NOT NULL,

      questions JSONB NOT NULL DEFAULT '[]'::jsonb,

      settings JSONB NOT NULL DEFAULT '{}'::jsonb,

      views INTEGER NOT NULL DEFAULT 0,

      response_count INTEGER NOT NULL DEFAULT 0,

      is_favorite BOOLEAN NOT NULL DEFAULT false,

      is_archived BOOLEAN NOT NULL DEFAULT false,

      published_at TIMESTAMPTZ,

      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // =========================
  // RESPONSES TABLE
  // =========================

  await query(`
    CREATE TABLE IF NOT EXISTS responses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      form UUID NOT NULL
        REFERENCES forms(id)
        ON DELETE CASCADE,

      answers JSONB NOT NULL DEFAULT '[]'::jsonb,

      completion_time INTEGER NOT NULL DEFAULT 0,

      meta JSONB NOT NULL DEFAULT '{}'::jsonb,

      submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // =========================
  // INDEXES
  // =========================

  await query(`
    CREATE INDEX IF NOT EXISTS idx_forms_owner
    ON forms(owner, is_archived, updated_at DESC);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_responses_form
    ON responses(form, submitted_at DESC);
  `);
}
export async function connectDB() {
  try {
    const { rows } = await query("SELECT current_database() AS db");

    console.log(`✅ Postgres connected: ${rows[0].db}`);
  } catch (error) {
    console.error("❌ Postgres connection error:", error.message);

    process.exit(1);
  }
}
