import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  generateInvite,
  acceptInvite,
} from '../controllers/invites.controller.js'

const router = Router()

router.use(requireAuth)

router.post('/:id', generateInvite)
router.get('/accept/:token', acceptInvite)

export default router
