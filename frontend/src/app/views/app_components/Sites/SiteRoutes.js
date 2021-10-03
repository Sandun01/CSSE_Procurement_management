import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const siteRoutes = [
    {
        path: '/sites/create',
        component: React.lazy(() => import('./CreateSite')),
        auth: authRoles.all,
    },
    {
        path: '/sites/all',
        component: React.lazy(() => import('./AllSites')),
        auth: authRoles.all,
    },

]

export default siteRoutes
