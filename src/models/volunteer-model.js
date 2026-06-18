import db from "./db.js";

// Add volunteer
export const addVolunteer = async (user_id, project_id) => {
    const sql = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
    `;
    await db.query(sql, [user_id, project_id]);
};

// Remove volunteer
export const removeVolunteer = async (user_id, project_id) => {
    const sql = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(sql, [user_id, project_id]);
};

// CHECK volunteer (IMPORTANT)
export const isVolunteer = async (user_id, project_id) => {
    const sql = `
        SELECT 1 FROM volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(sql, [user_id, project_id]);
    return result.rowCount > 0;
};

// Dashboard list
export const getVolunteerProjects = async (user_id) => {
    const sql = `
        SELECT p.*
        FROM project p
        JOIN volunteer v ON p.project_id = v.project_id
        WHERE v.user_id = $1
        ORDER BY p.project_date;
    `;
    const result = await db.query(sql, [user_id]);
    return result.rows;
};