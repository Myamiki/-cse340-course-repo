import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import session from 'express-session';

import router from './src/routes.js';
import flash from './src/middleware/flash.js';
import { testConnection } from './src/models/db.js';

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * VIEW ENGINE
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * CORE MIDDLEWARE
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * SESSION
 */
app.use(session({
    secret: process.env.SESSION_SECRET || 'temporary-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

/**
 * FLASH MIDDLEWARE (must come AFTER session)
 */
app.use(flash);

/**
 * GLOBAL VIEW VARIABLES
 * (safe defaults for ALL EJS templates)
 */
app.use((req, res, next) => {
    const user = req.session?.user || null;

    res.locals.NODE_ENV = NODE_ENV;
    res.locals.isLoggedIn = !!user;
    res.locals.user = user;

    // ✅ CRITICAL FIX: always define messages so EJS never crashes
    res.locals.messages = req.session.flash || {
        success: [],
        error: [],
        warning: [],
        info: []
    };

    next();
});

/**
 * ROUTES
 */
app.use(router);

/**
 * 404 HANDLER
 */
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found'
    });
});

/**
 * ERROR HANDLER
 */
app.use((err, req, res, next) => {
    console.error('Server Error:', err);

    res.status(err.status || 500).render('errors/500', {
        title: 'Server Error',
        error: err.message || 'Unexpected error'
    });
});

/**
 * START SERVER
 */
app.listen(PORT, '0.0.0.0', async () => {
    try {
        await testConnection();
        console.log('Database connected successfully');

        console.log(`Server running at: http://localhost:${PORT}`);
        console.log(`Network access: http://127.0.0.1:${PORT}`);
    } catch (err) {
        console.error('Database connection error:', err);
    }
});
