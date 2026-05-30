import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

/**
 * Categories list page (/categories)
 */
const showCategoriesPage = async (req, res) => {

    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Service Categories',
        categories
    });
};


/**
 * Category details page (/category/:id)
 */
const showCategoryDetailsPage = async (req, res) => {

    const id = req.params.id;

    const category = await getCategoryById(id);

    // Safety check (prevents crash if ID is invalid)
    if (!category) {
        return res.status(404).render('404', {
            title: 'Category Not Found'
        });
    }

    const projects = await getProjectsByCategoryId(id);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};


/**
 * Export controller functions
 */
export {
    showCategoriesPage,
    showCategoryDetailsPage
};