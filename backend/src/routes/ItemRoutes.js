import express from 'express'
import ItemController from '../controllers/ItemController.js'

import { 
    allAuth,
    protect, 
    pStaffAuth, 
    siteManagerAndP_StaffAuth
 } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, siteManagerAndP_StaffAuth, ItemController.addNewItem)
router.route('/').get(protect, siteManagerAndP_StaffAuth, ItemController.getAllItems)
router.route('/:id').get(protect, allAuth, ItemController.getItemByID)
router.route('/:id').put(protect, siteManagerAndP_StaffAuth, ItemController.updateItemByID)

router.route('/:id').delete(protect, siteManagerAndP_StaffAuth, ItemController.deleteItemByID)

export default router