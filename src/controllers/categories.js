import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments
} from '../models/categories.js';

import {
    getProjectDetails,
    getCategoriesByProjectId
} from '../models/projects.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Service Categories',
            categories
        });
    } catch (err) {
        next(err);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).render('errors/404', {
                title: 'Category Not Found'
            });
        }

        const projects = await getProjectsByCategoryId(id);

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (err) {
        next(err);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).render('errors/404', {
                title: 'Project Not Found'
            });
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (err) {
        next(err);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        let selectedCategoryIds = req.body.categoryIds || [];

        if (!Array.isArray(selectedCategoryIds)) {
            selectedCategoryIds = [selectedCategoryIds];
        }

        await updateCategoryAssignments(projectId, selectedCategoryIds);

        req.flash('success', 'Categories updated successfully!');

        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
