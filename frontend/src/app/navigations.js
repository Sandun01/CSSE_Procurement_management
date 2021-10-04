import { authRoles } from './auth/authRoles'

export const navigations = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'dashboard',
        auth: authRoles.all,
    },
    {
        name: 'Items Management',
        icon: 'account_tree',
        auth: authRoles.items_management,
        children: [
            {
                name: 'New Item',
                path: '/items/new',
                iconText: 'N',
                auth: authRoles.items_management,
            },
            {
                name: 'All Items',
                path: '/items/all',
                iconText: 'A',
                auth: authRoles.items_management,
            },
        ],
    },
    {
        name: 'Site Management',
        icon: 'apartment',
        auth: authRoles.super_admin,
        children: [
            {
                name: 'New Site',
                path: '/sites/create',
                iconText: 'N',
                auth: authRoles.super_admin,
            },
            {
                name: 'All Sites',
                path: '/sites/all',
                iconText: 'S',
                auth: authRoles.super_admin,
            },
        ],
    },
    {
        name: 'Orders',
        icon: 'list_alt',
        auth: authRoles.all,
        children: [
            //site manager
            {
                name: 'My Requisition',
                path: '/requisition/my',
                iconText: 'R',
                auth: authRoles.only_siteManager,
            },
            //procurement staff
            {
                name: 'Purchase Orders',
                path: '/requisition/all',
                iconText: 'R',
                auth: authRoles.procurement_staff,
            },
            //supplier
            {
                name: 'All Deliveries',
                path: '/delivery_advice_notes/all',
                iconText: 'C',
                auth: authRoles.supplier,
            },
            {
                name: 'Purchase Orders',
                path: '/purchaseOrders/my',
                iconText: 'R',
                auth: authRoles.supplier,
            },
            {
                name: 'All Invoices',
                path: '/invoices/all',
                iconText: 'R',
                auth: authRoles.supplier,
            },
        ],
    },

    {
        name: 'Users',
        icon: 'supervised_user_circle_icon',
        auth: authRoles.super_admin,
        children: [
            {
                name: 'Create New User',
                path: '/users/create',
                iconText: 'N',
                auth: authRoles.super_admin,
            },
            {
                name: 'All Users',
                path: '/users/all',
                iconText: 'A',
                auth: authRoles.super_admin,
            },
        ],
    },

]
