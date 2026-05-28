import { Router } from 'express'
import {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
} from '../controllers/sites.controller.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = Router()

router
  .route('/')
  .post(verifyJWT, createSite)
  .get(verifyJWT, getSites)

router
  .route('/:id')
  .get(verifyJWT, getSite)
  .put(verifyJWT, updateSite)
  .delete(verifyJWT, deleteSite)

export default router
