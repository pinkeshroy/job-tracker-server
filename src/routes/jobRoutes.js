import express from 'express'
import { createJob } from '../controllers/job/createJob.js'
import { deleteJob } from '../controllers/job/deleteJob.js'
import { updateJob } from '../controllers/job/updateJob.js'

const router = express.Router()

router.post('/job', createJob)
router.put('/job', updateJob)
router.delete('/job', deleteJob)

export default router
