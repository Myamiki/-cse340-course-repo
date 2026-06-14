import pg from 'pg';
const { Pool } = pg;

/**
 * Temporary diagnostics
 */
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);

        console.log('DB Host:', url.hostname);
        console.log('DB Database:', url.pathname);
    } catch (err) {
        console.error('DATABASE_URL format error:', err.message);
    }
}

/**
 * PostgreSQL connection pool
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

/**
 * DB wrapper (adds logging in development)
 */
let db;

if (
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_SQL_LOGGING === 'true'
) {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();

                const res = await pool.query(text, params);

                const duration = Date.now() - start;

                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });

                return res;
            } catch (error) {
                console.error('Query error:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });

                throw error;
            }
        },

        async close() {
            return pool.end();
        }
    };
} else {
    db = pool;
}

/**
 * Test DB connection
 */
const testConnection = async () => {
    try {
        const result = await db.query(
            'SELECT NOW() as current_time'
        );

        console.log(
            'Database connected:',
            result.rows[0].current_time
        );

        return true;
    } catch (error) {
        console.error(
            'Database connection failed:',
            error.message
        );

        throw error;
    }
};

export default db;
export { testConnection };
