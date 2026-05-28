import { Router } from 'express'
import {
  getPageViews,
  getTopPages,
  getTrafficSources,
  getBrowserStats,
  getOSStats,
  getCountryStats,
} from '../controllers/analytics.controller.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = Router()

router.use('/:siteId', verifyJWT)

router.get('/:siteId/pageViews', getPageViews)
router.get('/:siteId/topPages', getTopPages)
router.get('/:siteId/sources', getTrafficSources)
router.get('/:siteId/browsers', getBrowserStats)
router.get('/:siteId/os', getOSStats)
router.get('/:siteId/countries', getCountryStats)

export default router
