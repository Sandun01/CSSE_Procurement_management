export const authRoles = {
    all: ['SUPER_ADMIN', 'SUPERVISOR', 'SUPPLIER', 'P_STAFF', 'SITE_MANAGER'], //all users
    super_admin: ['SUPER_ADMIN'], // Only Super Admin(Management) has access
    supervisor: ['SUPERVISOR', 'SUPER_ADMIN'], // Only Supervisor
    procurement_staff: ['P_STAFF', 'SUPERVISOR', 'SUPER_ADMIN'], // Only procurement staff and supervisor has access
    supplier: ['SUPPLIER'], //Supplier
    site_manager: ['SITE_MANAGER', 'SUPER_ADMIN'], // Site Manager

    //specific auth roles
    only_siteManager: ['SITE_MANAGER'],
    items_management: ['P_STAFF', 'SITE_MANAGER', 'SUPER_ADMIN'],
    order_management: ['P_STAFF', 'SITE_MANAGER', 'SUPER_ADMIN', 'SUPPLIER'],
}
