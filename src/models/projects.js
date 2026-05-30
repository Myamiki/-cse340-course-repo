import db from './db.js';

// =========================
// Get all projects
// =========================
const getAllProjects = async () => {

    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project;
    `;

    const result = await db.query(query);
    return result.rows;
};


// =========================
// Get projects by organization
// =========================
const getProjectsByOrganizationId = async (organizationId) => {

    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows;
};


// =========================
// Get upcoming projects (LIMITED)
// =========================
const getUpcomingProjects = async (numberOfProjects) => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date
        LIMIT $1;
    `;

    const result = await db.query(query, [numberOfProjects]);
    return result.rows;
};


// =========================
// Get single project details
// =========================
const getProjectDetails = async (projectId) => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows[0];
};


// =========================
// Get categories for a project (IMPORTANT)
// =========================
const getCategoriesByProjectId = async (projectId) => {

    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};


// =========================
// Get all projects for a category (IMPORTANT)
// =========================
const getProjectsByCategoryId = async (categoryId) => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        JOIN project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};


// =========================
// Export ALL functions
// =========================
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};