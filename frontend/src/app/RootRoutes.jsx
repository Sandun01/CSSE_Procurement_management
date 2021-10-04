import React from 'react'
import { Redirect } from 'react-router-dom'

import dashboardRoutes from './views/dashboard/DashboardRoutes'
import materialRoutes from './views/material-kit/MaterialRoutes'
import UserRoutes from './views/app_components/users/UserRoutes'
import ItemRoutes from './views/app_components/Items/ItemRoutes'
import PurchaseOrderRoutes from './views/app_components/purchase_orders/PurchaseOrderRoutes'
import SiteRoutes from './views/app_components/Sites/SiteRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/dashboard/default" />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    ...dashboardRoutes,
    ...materialRoutes,
    ...ItemRoutes,
    ...PurchaseOrderRoutes,
    ...SiteRoutes,
    ...UserRoutes,
    ...redirectRoute,
    ...errorRoute,
]

export default routes
