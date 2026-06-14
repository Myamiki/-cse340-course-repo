import pg from 'pg';
const { Pool } = pg;

/**
 * PostgreSQL connection pool
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
<<<<<<< HEAD
    ssl: {
        rejectUnauthorized: false
    }
=======
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
>>>>>>> bbe22e7 (Fix database connection and production config)
});
/**
 * DB wrapper (adds logging in development)
 */
let db;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
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
        const result = await db.query('SELECT NOW() as current_time');

        console.log('Database connected:', result.rows[0].current_time);

        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

<<<<<<< HEAD
export { db as default, testConnection };
=======
export default db;
export { testConnection };
>>>>>>> bbe22e7 (Fix database connection and production config)
