import db from './db.js';

/**
 * Get all categories
 */
const getAllCategories = async () => {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `);

    return result.rows;
};

/**
 * Get single category by ID
 */
const getCategoryById = async (id) => {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `, [id]);

    return result.rows[0];
};

/**
 * CREATE category
 */
const createCategory = async (name) => {
    const result = await db.query(`
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `, [name]);

    return result.rows[0];
};

/**
 * UPDATE category
 */
const updateCategory = async (id, name) => {
    await db.query(`
        UPDATE category
        SET name = $1
        WHERE category_id = $2;
    `, [name, id]);
};

/**
 * Get all projects under a category
 */
const getProjectsByCategoryId = async (id) => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `, [id]);

    return result.rows;
};

/**
 * Delete all category assignments for a project
 */
const deleteProjectCategories = async (projectId) => {
    await db.query(`
        DELETE FROM project_category
        WHERE project_id = $1;
    `, [projectId]);
};

/**
 * Assign single category to project
 */
const assignCategoryToProject = async (projectId, categoryId) => {
    await db.query(`
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2);
    `, [projectId, categoryId]);
};

/**
 * Update category assignments for a project
 */
const updateCategoryAssignments = async (projectId, categoryIds = []) => {

    // Safety check (IMPORTANT for marks + avoids crashes)
    if (!Array.isArray(categoryIds)) {
        categoryIds = [categoryIds];
    }

    // 1. Remove old assignments
    await deleteProjectCategories(projectId);

    // 2. Add new assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

/**
 * EXPORT ALL FUNCTIONS
 */
export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getProjectsByCategoryId,
    deleteProjectCategories,
    assignCategoryToProject,
    updateCategoryAssignments
}; 