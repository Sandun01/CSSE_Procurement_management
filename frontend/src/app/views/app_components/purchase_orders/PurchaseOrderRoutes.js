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
    

]

export default purchaseOrderRoutes
