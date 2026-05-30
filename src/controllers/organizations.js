// Import model functions
import { 
    getAllOrganizations, 
    getOrganizationDetails 
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// All organizations page
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('organizations', {
        title: 'Our Partner Organizations',
        organizations
    });
};

// Organization details page
const showOrganizationDetailsPage = async (req, res) => {

    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    res.render('organization', {
        title: 'Organization Details',
        organization: organizationDetails,
        projects
    });
};

// Export controllers
export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};