import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage   // ✅ ADDED
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/**
 * ======================
 * HOME
 * ======================
 */
router.get('/', showHomePage);

/**
 * ======================
 * AUTHENTICATION
 * ======================
 */
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);

// ✅ USERS PAGE (ADMIN ONLY)
router.get(
    '/users',
    requireRole('admin'),
    showUsersPage
);

/**
 * ======================
 * ORGANIZATIONS
 * ======================
 */
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

/**
 * ======================
 * PROJECTS
 * ======================
 */
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

/**
 * ======================
 * CATEGORY ASSIGNMENT
 * ======================
 */
router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    processAssignCategoriesForm
);

/**
 * ======================
 * CATEGORIES
 * ======================
 */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

/**
 * ======================
 * ERROR TEST
 * ======================
 */
router.get('/test-error', testErrorPage);

export default router;