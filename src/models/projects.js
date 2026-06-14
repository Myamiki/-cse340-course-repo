import db from './db.js';

// =========================
// Get all projects
// =========================
const getAllProjects = async () => {
    const result = await db.query(`
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM project
        ORDER BY project_date DESC;
    `);

    return result.rows;
};

// =========================
// Get projects by organization
// =========================
const getProjectsByOrganizationId = async (organizationId) => {
    const result = await db.query(`
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date;
    `, [organizationId]);

    return result.rows;
};

// =========================
// Get upcoming projects
// =========================
const getUpcomingProjects = async (limit) => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date
        LIMIT $1;
    `, [limit]);

    return result.rows;
};

// =========================
// Get single project details
// =========================
const getProjectDetails = async (projectId) => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `, [projectId]);

    return result.rows.length ? result.rows[0] : null;
};

// =========================
// Get categories for a project
// =========================
const getCategoriesByProjectId = async (projectId) => {
    const result = await db.query(`
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `, [projectId]);

    return result.rows;
};

// =========================
// Get projects by category
// =========================
const getProjectsByCategoryId = async (categoryId) => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        JOIN project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `, [categoryId]);

    return result.rows;
};

// =========================
// CREATE project
// =========================
const createProject = async (title, description, location, date, organizationId) => {

    const result = await db.query(`
        INSERT INTO project (
            title,
            description,
            location,
            project_date,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    if (!result.rows.length) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created project:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// =========================
// UPDATE project
// =========================
const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {

    const result = await db.query(`
        UPDATE project
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `, [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ]);

    if (!result.rows.length) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project:', projectId);
    }

    return result.rows[0].project_id;
};

// =========================
// EXPORTS
// =========================
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createProject,
    updateProject
};