import { Router } from 'express'
import { trackEvent } from '../controllers/events.controller.js'

const router = Router()

router.post('/', trackEvent)

export default router
