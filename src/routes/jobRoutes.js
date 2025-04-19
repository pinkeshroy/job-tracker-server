import express from 'express'
import { createJob } from '../controllers/job/createJob.js'
import { deleteJob } from '../controllers/job/deleteJob.js'
import { getAllJobs } from '../controllers/job/getAllJobs.js'
import { updateJob } from '../controllers/job/updateJob.js'
import { applyToJob } from '../controllers/jobApplication/applyToJob.js'
import { deleteApplication } from '../controllers/jobApplication/deleteApplication.js'
import { getApplications } from '../controllers/jobApplication/getApplications.js'
import { getApplicationStats } from '../controllers/jobApplication/getApplicationStats.js'
import { updateApplication } from '../controllers/jobApplication/updateApplication.js'

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', createJob);
router.put('/', updateJob);
router.delete('/', deleteJob);
router.post('/:jobId/apply', applyToJob);
router.get('/applications', getApplications);
router.put('/applications/:applicationId', updateApplication);
router.delete('/applications/:applicationId', deleteApplication);
router.get('/applications/stats', getApplicationStats);

export default router
