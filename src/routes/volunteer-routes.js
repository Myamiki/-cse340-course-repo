import express from "express";
import * as volunteerController from "../controllers/volunteerController.js";

// IMPORTANT: adjust this import if your middleware has a different name
import { requireLogin } from "../controllers/users.js";

const router = express.Router();

/**

* Add user as volunteer to a project
* POST /volunteer/add/:projectId
  */
  router.post(
  "/add/:projectId",
  requireLogin,
  volunteerController.addVolunteer
  );

/**

* Remove user as volunteer from a project
* POST /volunteer/remove/:projectId
  */
  router.post(
  "/remove/:projectId",
  requireLogin,
  volunteerController.removeVolunteer
  );

export default router;
