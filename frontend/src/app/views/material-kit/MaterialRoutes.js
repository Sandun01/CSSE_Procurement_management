import React from 'react'
import { authRoles } from '../../auth/authRoles'

const materialRoutes = [
    {
        path: '/material/table',
        component: React.lazy(() => import('./tables/AppTable')),
        auth: authRoles.supplier,
    },
]

export default materialRoutes
