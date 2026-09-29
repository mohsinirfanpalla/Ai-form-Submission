
import { query, pool } from "./db.js";

async function migrate() {
    console.log("🚀 Starting database migration...");

    // Enable UUID generation
    await query(`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);

    console.log("✅ pgcrypto extension ready");


    // -----------------------------
    // USERS TABLE
    // -----------------------------

    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            name VARCHAR(120) NOT NULL,

            email VARCHAR(255) NOT NULL UNIQUE,

            password TEXT NOT NULL,

            avatar_color VARCHAR(20) DEFAULT '#0c8b7c',

            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    console.log("✅ users table ready");


    // -----------------------------
    // FORMS TABLE
    // -----------------------------

    await query(`
        CREATE TABLE IF NOT EXISTS forms (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            owner UUID NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            title VARCHAR(255)
                NOT NULL
                DEFAULT 'Untitled form',

            description TEXT,

            theme VARCHAR(50)
                NOT NULL
                DEFAULT 'modern',

            status VARCHAR(20)
                NOT NULL
                DEFAULT 'draft'
                CHECK (
                    status IN ('draft', 'published')
                ),

            slug VARCHAR(255)
                UNIQUE,

            questions JSONB
                NOT NULL
                DEFAULT '[]'::jsonb,

            settings JSONB
                NOT NULL
                DEFAULT '{}'::jsonb,

            views INTEGER
                NOT NULL
                DEFAULT 0,

            response_count INTEGER
                NOT NULL
                DEFAULT 0,

            is_favorite BOOLEAN
                NOT NULL
                DEFAULT FALSE,

            is_archived BOOLEAN
                NOT NULL
                DEFAULT FALSE,

            published_at TIMESTAMPTZ,

            created_at TIMESTAMPTZ
                NOT NULL
                DEFAULT NOW(),

            updated_at TIMESTAMPTZ
                NOT NULL
                DEFAULT NOW()
        );
    `);

    console.log("✅ forms table ready");


    // -----------------------------
    // RESPONSES TABLE
    // -----------------------------

    await query(`
        CREATE TABLE IF NOT EXISTS responses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            form UUID NOT NULL
                REFERENCES forms(id)
                ON DELETE CASCADE,

            answers JSONB
                NOT NULL
                DEFAULT '{}'::jsonb,

            respondent JSONB
                DEFAULT '{}'::jsonb,

            meta JSONB
                DEFAULT '{}'::jsonb,

            submitted_at TIMESTAMPTZ
                NOT NULL
                DEFAULT NOW()
        );
    `);

    console.log("✅ responses table ready");


    // -----------------------------
    // INDEXES
    // -----------------------------

    await query(`
        CREATE INDEX IF NOT EXISTS idx_forms_owner
        ON forms(owner);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_forms_archived
        ON forms(is_archived);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_forms_updated
        ON forms(updated_at);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_responses_form
        ON responses(form);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_responses_submitted
        ON responses(submitted_at);
    `);

    console.log("✅ indexes ready");


    console.log("");
    console.log("🎉 Database migration completed successfully!");


    await pool.end();
}


migrate().catch(async (error) => {
    console.error("❌ Migration failed:");
    console.error(error);

    await pool.end();

    process.exit(1);
});

