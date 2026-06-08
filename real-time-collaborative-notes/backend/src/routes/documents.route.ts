import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  getAllDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/documents.controller.js'

const router = Router()

router.use(requireAuth)

router
    .route('/')
    .get(getAllDocuments)
    .post(createDocument)

router
  .route('/:id')
  .get(getDocument)
  .patch(updateDocument)
  .delete(deleteDocument)

  export default router