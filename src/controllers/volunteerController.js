import * as volunteerModel from "../models/volunteer-model.js";

/**
 * Add user as volunteer to a project
 */
export async function addVolunteer(req, res, next) {
    try {
        if (!req.session.user) {
            req.flash("error", "You must be logged in to volunteer.");
            return res.redirect("/login");
        }

        const user_id = req.session.user.user_id;
        const project_id = req.params.projectId;

        await volunteerModel.addVolunteer(user_id, project_id);

        req.flash("success", "You have successfully signed up as a volunteer.");

        return res.redirect(`/project/${project_id}`);
    } catch (error) {
        next(error);
    }
}

/**
 * Remove user as volunteer from a project
 */
export async function removeVolunteer(req, res, next) {
    try {
        if (!req.session.user) {
            req.flash("error", "You must be logged in.");
            return res.redirect("/login");
        }

        const user_id = req.session.user.user_id;
        const project_id = req.params.projectId;

        await volunteerModel.removeVolunteer(user_id, project_id);

        req.flash("success", "You have been removed as a volunteer.");

        return res.redirect(`/project/${project_id}`);
    } catch (error) {
        next(error);
    }
}