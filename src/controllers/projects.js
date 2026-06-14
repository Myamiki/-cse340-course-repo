import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (err) {
        next(err);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('errors/404', {
                title: 'Project Not Found'
            });
        }

        const categories = await getCategoriesByProjectId(projectId);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (err) {
        next(err);
    }
};

const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('new-project', {
            title: 'Add New Service Project',
            organizations
        });
    } catch (err) {
        next(err);
    }
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-project');
        }

        const { title, description, location, date, organizationId } = req.body;

        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (err) {
        next(err);
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            return res.status(404).render('errors/404', {
                title: 'Project Not Found'
            });
        }

        res.render('edit-project', {
            title: 'Edit Project',
            project,
            organizations
        });
    } catch (err) {
        next(err);
    }
};

const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-project/${projectId}`);
        }

        const { title, description, location, date, organizationId } = req.body;

        await updateProject(projectId, title, description, location, date, organizationId);

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Date is required'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
];

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};
