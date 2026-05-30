import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId
} from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;


// =====================
// Show upcoming projects page
// =====================
const showProjectsPage = async (req, res) => {

    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
};


// =====================
// Show single project details page
// =====================
const showProjectDetailsPage = async (req, res) => {

    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
        return res.status(404).render('404', {
            title: 'Project Not Found'
        });
    }

    const categories = await getCategoriesByProjectId(projectId);

    res.render('project', {
        title: project.title,
        project,
        categories
    });
};


// =====================
// Export controllers
// =====================
export {
    showProjectsPage,
    showProjectDetailsPage
};