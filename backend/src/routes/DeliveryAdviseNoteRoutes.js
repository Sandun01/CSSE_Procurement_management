import express from 'express'
import DeliveryAdviseNoteController from '../controllers/DeliveryAdviseNoteController.js'

import { 
    protect, 
    allAuth, 
    supplierAuth,
    siteManagerAuth,
    authSiteManger_Supplier,
 } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, supplierAuth, DeliveryAdviseNoteController.createNote)
router.route('/').get(protect, supplierAuth, DeliveryAdviseNoteController.getAllNotes)
router.route('/:id').get(protect, authSiteManger_Supplier, DeliveryAdviseNoteController.getNoteByID)
router.route('/user/:id').get(protect, supplierAuth, DeliveryAdviseNoteController.getNotesByUserID)
router.route('/order/:id').get(protect, allAuth, DeliveryAdviseNoteController.getNotesByOrderID)

router.route('/sign/:id').put(protect, siteManagerAuth, DeliveryAdviseNoteController.signNoteByUser)

export default router