import express from 'express'
import userController from '../controllers/userController.js'
import {
    protect, 
    superAdminAuth,
    siteManagerAndP_StaffAuth,
    allAuth,
 } from '../middleware/authMiddleware.js'

const router = express.Router()


//user routes
router.route('/').get(protect, superAdminAuth, userController.getUsers)
router.route('/register').post(protect, superAdminAuth, userController.createUser)
router.route('/login').post(userController.authUser)
router.route('/profile/auth').post(userController.checkTokenExpiration)
router.route('/delete/:id').delete(protect, superAdminAuth, userController.deleteUser)
router.route('/view/:id').get(protect, userController.getUserByID)

//other
router.route('/site_managers').get(protect, superAdminAuth, userController.getAllSiteManagers)
router.route('/supplier').get(protect, siteManagerAndP_StaffAuth, userController.getAllSuppliers)

export default router