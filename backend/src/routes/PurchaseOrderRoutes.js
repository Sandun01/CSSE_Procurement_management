import express from 'express'
import PurchaseOrderController from '../controllers/PurchaseOrderController.js'

import { 
    allAuth,
    protect, 
    pStaffAuth, 
    siteManagerAndP_StaffAuth,
    supplierAuth
 } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.createRequisition)

router.route('/all').get(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.getAllRequisitions)

router.route('/comment/add/:id').put(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.addCommentByStaff)
router.route('/comment/finalize/:id').put(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.addCommentToRequisitionAndFinalize)

router.route('/checked/:id').put(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.markOrderItemsCheckedStatus)

router.route('/status/:id').put(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.approveRejectPurchaseOrder)

router.route('/site_manager/all/:id').get(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.getAllRequisitionsByUserID)
router.route('/site_manager/saved/:id').get(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.getSavedRequisitionsByUserID)

router.route('/supplier/:id').get(protect, supplierAuth, PurchaseOrderController.getPurchaseOrdersBySupplierID)

router.route('/items/add/:id').put(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.addItemsToRequisition)
router.route('/items/delete/:id').delete(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.deleteItemsInRequisition)
router.route('/items/edit/:id').put(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.editItemsInRequisition)

router.route('/:id').get(protect, allAuth, PurchaseOrderController.getPurchaseOrderByID)
router.route('/:id').delete(protect, siteManagerAndP_StaffAuth, PurchaseOrderController.deletePurchaseOrderByID)


export default router