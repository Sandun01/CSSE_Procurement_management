import express from 'express'
import SiteController from '../controllers/SiteController.js'

import { 
    protect, 
    superAdminAuth,
    siteManagerAndP_StaffAuth,
 } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, superAdminAuth, SiteController.createSite)
router.route('/').get(protect, superAdminAuth, SiteController.getAllSites)
router.route('/:id').get(protect, superAdminAuth, SiteController.getSiteByID)
router.route('/:id').delete(protect, superAdminAuth, SiteController.deleteSite)

router.route('/user/:id').get(protect, siteManagerAndP_StaffAuth, SiteController.getSitesByUserID)

export default router