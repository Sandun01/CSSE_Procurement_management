import express from 'express'
import InvoiceController from '../controllers/InvoiceController.js'

import { 
    protect, 
    allAuth, 
    supplierAuth,
    authSiteManger_Supplier,
 } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, supplierAuth, InvoiceController.createInvoice)
router.route('/:id').get(protect, allAuth, InvoiceController.getInvoiceByID)
router.route('/supplier/:id').get(protect, supplierAuth, InvoiceController.getAllInvoicesBySupplierID)
router.route('/order/:id').get(protect, allAuth, InvoiceController.getInvoicesByOrderID)

export default router