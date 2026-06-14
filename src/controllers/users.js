import bcrypt from 'bcrypt';
import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

/**
 * ======================
 * REGISTER
 * ======================
 */

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/register');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);

        if (error.code === '23505') {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        req.flash('error', 'An error occurred during registration.');
        return res.redirect('/register');
    }
};

/**
 * ======================
 * LOGIN
 * ======================
 */

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;

        req.flash('success', 'Login successful.');
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred while logging in.');
        return res.redirect('/login');
    }
};

/**
 * ======================
 * LOGOUT
 * ======================
 */

const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);
        }
        res.redirect('/login');
    });
};

/**
 * ======================
 * AUTH MIDDLEWARE
 * ======================
 */

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

/**
 * ======================
 * DASHBOARD
 * ======================
 */

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

/**
 * ======================
 * USERS PAGE (ADMIN ONLY)
 * ======================
 */

const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Users',
            users
        });
    } catch (error) {
        console.error('Error loading users page:', error);

        req.flash('error', 'Unable to load users page.');
        res.redirect('/dashboard');
    }
};

/**
 * ======================
 * EXPORTS
 * ======================
 */

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};