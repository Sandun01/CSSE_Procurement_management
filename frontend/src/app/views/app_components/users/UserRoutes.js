import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const userRoutes = [
    {
        path: '/users/all',
        component: React.lazy(() => import('../users/ViewAllUsers')),
        auth: authRoles.super_admin,
    },
    {
        path: '/users/create',
        component: React.lazy(() => import('../users/RegisterUser')),
        auth: authRoles.super_admin,
    },
    {
        path: '/users/profile',
        component: React.lazy(() => import('../users/UserProfile')),
        auth: authRoles.all,
    },
]

export default userRoutes
