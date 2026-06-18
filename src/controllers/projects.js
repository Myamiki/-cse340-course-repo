import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

import { isVolunteer as checkIfVolunteer } from '../models/volunteer-model.js';


/**
 * LIST PAGE
 */
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(5) || [];

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (err) {
        console.error('Error loading projects page:', err);
        next(err);
    }
};


/**
 * DETAILS PAGE
 */
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        if (!projectId) {
            return res.status(400).render('errors/404', {
                title: 'Project Not Found'
            });
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('errors/404', {
                title: 'Project Not Found'
            });
        }

        const categories = await getCategoriesByProjectId(projectId) || [];

        let volunteerStatus = false;

        // ✅ CONSISTENT SESSION HANDLING
        const userId = req.session?.user?.user_id || req.session?.user_id;

        if (userId) {
            try {
                volunteerStatus = await checkIfVolunteer(
                    userId,
                    Number(projectId)
                );
            } catch (err) {
                console.error("Volunteer check failed:", err);
                volunteerStatus = false;
            }
        }

        res.render('project', {
            title: project.title,
            project,
            categories,
            user: req.session.user || null,
            volunteerStatus
        });

    } catch (err) {
        console.error('Error loading project details:', err);
        next(err);
    }
};


/**
 * NEW PROJECT FORM
 */
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations() || [];

        res.render('new-project', {
            title: 'Add New Service Project',
            organizations
        });
    } catch (err) {
        console.error('Error loading new project form:', err);
        next(err);
    }
};


/**
 * CREATE PROJECT
 */
const processNewProjectForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(e => req.flash('error', e.msg));
            return res.redirect('/new-project');
        }

        const { title, description, location, date, organizationId } = req.body;

        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project created successfully!');
        res.redirect(`/project/${newProjectId}`);

    } catch (err) {
        console.error(err);
        next(err);
    }
};


/**
 * EDIT FORM
 */
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations() || [];

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
        console.error(err);
        next(err);
    }
};


/**
 * UPDATE PROJECT
 */
const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(e => req.flash('error', e.msg));
            return res.redirect(`/edit-project/${projectId}`);
        }

        const { title, description, location, date, organizationId } = req.body;

        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);

    } catch (err) {
        console.error(err);
        next(err);
    }
};


/**
 * VALIDATION
 */
const projectValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('organizationId').notEmpty().withMessage('Organization is required')
];


/**
 * EXPORTS
 */
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};