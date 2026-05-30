import db from './db.js';

/**
 * Get all categories
 */
const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

/**
 * Get a single category by ID
 */
const getCategoryById = async (id) => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

/**
 * Get all projects under a category
 */
const getProjectsByCategoryId = async (id) => {
    const query = `
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
    `;

    const result = await db.query(query, [id]);
    return result.rows;
};

/**
 * Export all functions
 */
export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
};