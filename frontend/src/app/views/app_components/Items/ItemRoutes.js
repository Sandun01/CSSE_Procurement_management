import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const itemRoutes = [
    {
        path: '/items/new',
        component: React.lazy(() => import('./AddNewItem')),
        auth: authRoles.items_management,
    },
    {
        path: '/items/all',
        component: React.lazy(() => import('./AllItems')),
        auth: authRoles.items_management,
    },
    {
        path: '/items/edit/:id',
        component: React.lazy(() => import('./EditItem')),
        auth: authRoles.items_management,
    },
    {
        path: '/items/view/:id',
        component: React.lazy(() => import('./ViewItem')),
        auth: authRoles.all,
    },
]

export default itemRoutes
