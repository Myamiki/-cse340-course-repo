import db from './db.js';

/**
 * Get all organizations
 */
const getAllOrganizations = async () => {

    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get single organization details
 */
const getOrganizationDetails = async (organizationId) => {

    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Create a new organization
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {

    const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const queryParams = [name, description, contactEmail, logoFilename];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    return result.rows[0].organization_id;
};

/**
 * UPDATE an existing organization (EDIT FEATURE)
 */
const updateOrganization = async (
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
) => {

    const query = `
        UPDATE organization
        SET name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `;

    const queryParams = [
        name,
        description,
        contactEmail,
        logoFilename,
        organizationId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Organization not found');
    }

    return result.rows[0].organization_id;
};

/**
 * Export all model functions
 */
export {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
};