import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const purchaseOrderRoutes = [
    {
        path: '/requisition/all',
        component: React.lazy(() => import('./AllRequisitions')),
        auth: authRoles.procurement_staff,
    },
    {
        path: '/requisition/admin/view/:id',
        component: React.lazy(() => import('./ViewPurchaseOrder')),
        auth: authRoles.procurement_staff,
    },
    //site manager
    {
        path: '/requisition/create',
        component: React.lazy(() => import('./CreateRequestion')),
        auth: authRoles.all,
    },
    {
        path: '/requisition/my',
        component: React.lazy(() => import('./MyRequisitions')),
        auth: authRoles.site_manager,
    },
    {
        path: '/requisition/view/:id',
        component: React.lazy(() => import('./ViewRequisition')),
        auth: authRoles.procurement_staff,
    },
    //supplier
    {
        path: '/purchaseOrders/my',
        component: React.lazy(() => import('./SupplierOrders')),
        auth: authRoles.supplier,
    },
    {
        path: '/purchaseOrders/view/:id',
        component: React.lazy(() => import('./ViewSupplierPurchaseOrder')),
        auth: authRoles.supplier,
    },
    {
        path: '/delivery_advice_notes/create/:id',
        component: React.lazy(() => import('./delivery_advice_note/CreateDeliveryAdviceNote')),
        auth: authRoles.supplier,
    },
    {
        path: '/delivery_advice_notes/view/:id',
        component: React.lazy(() => import('./delivery_advice_note/ViewDeliveryNote')),
        auth: authRoles.order_management,
    },
    {
        path: '/delivery_advice_notes/all',
        component: React.lazy(() => import('./delivery_advice_note/AllDeliveries')),
        auth: authRoles.supplier,
    },
    {
        path: '/invoices/all',
        component: React.lazy(() => import('./invoices/AllInvoices')),
        auth: authRoles.supplier,
    },
    {
        path: '/invoices/create/:id',
        component: React.lazy(() => import('./invoices/CreateInvoice')),
        auth: authRoles.supplier,
    },
    {
        path: '/invoices/view/:id',
        component: React.lazy(() => import('./invoices/ViewInvoice')),
        auth: authRoles.order_management,
    },

]

export default purchaseOrderRoutes
