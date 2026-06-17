import pool from "./db.js";

export async function addVolunteer(user_id, project_id) {
  const sql = `
    INSERT INTO volunteer (user_id, project_id)
    VALUES ($1, $2)
    RETURNING *
  `;

  return await pool.query(sql, [user_id, project_id]);
}

export async function removeVolunteer(user_id, project_id) {
  const sql = `
    DELETE FROM volunteer
    WHERE user_id = $1
    AND project_id = $2
  `;

  return await pool.query(sql, [user_id, project_id]);
}

export async function getVolunteerProjects(user_id) {
  const sql = `
    SELECT p.*
    FROM project p
    INNER JOIN volunteer v
      ON p.project_id = v.project_id
    WHERE v.user_id = $1
    ORDER BY p.project_date
  `;

  const result = await pool.query(sql, [user_id]);

  return result.rows;
}

export async function isVolunteer(user_id, project_id) {
  const sql = `
    SELECT *
    FROM volunteer
    WHERE user_id = $1
    AND project_id = $2
  `;

  const result = await pool.query(sql, [user_id, project_id]);

  return result.rowCount > 0;
}