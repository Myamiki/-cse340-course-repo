import bcrypt from 'bcrypt';
import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

import * as volunteerModel from '../models/volunteer-model.js';

/**
 * ======================
 * REGISTER
 * ======================
 */

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
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
        console.error(error);

        if (error.code === '23505') {
            req.flash('error', 'Email already exists.');
        } else {
            req.flash('error', 'Registration failed.');
        }

        return res.redirect('/register');
    }
};

/**
 * ======================
 * LOGIN
 * ======================
 */

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
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
        console.error(error);
        req.flash('error', 'Login error.');
        return res.redirect('/login');
    }
};

/**
 * ======================
 * LOGOUT
 * ======================
 */

const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

/**
 * ======================
 * AUTH MIDDLEWARE
 * ======================
 */

const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must log in first.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must log in first.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
        req.flash('error', 'Access denied.');
        return res.redirect('/dashboard');
    }

    next();
};

/**
 * ======================
 * DASHBOARD (FIXED)
 * ======================
 */
const showDashboard = async (req, res) => {
    try {
        const user = req.session.user;

        let volunteerProjects = [];

        try {
            volunteerProjects =
                await volunteerModel.getVolunteerProjects(user.user_id);
        } catch (dbError) {
            console.error("Volunteer query failed:", dbError);
            volunteerProjects = [];
        }

        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            user, // ✅ IMPORTANT: allows EJS role + login checks
            volunteerProjects
        });

    } catch (error) {
        console.error('Dashboard error:', error);

        req.flash('error', 'Unable to load dashboard.');
        return res.redirect('/login');
    }
};
/**
 * ======================
 * USERS PAGE
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
        console.error(error);
        req.flash('error', 'Unable to load users.');
        res.redirect('/dashboard');
    }
};

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