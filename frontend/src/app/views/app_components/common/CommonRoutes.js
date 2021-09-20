import React from 'react'
import { authRoles } from '../../auth/authRoles'

const commonRoutes = [
    {
        path: '/common',
        component: React.lazy(() => import('./Analytics')),
        auth: authRoles.super_admin,
    }
]

export default commonRoutes
