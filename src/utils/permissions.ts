export type Permission = 
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_transactions'
  | 'manage_settings'
  | 'export_data'
  | 'view_reports';

export type Role = 'admin' | 'manager' | 'accountant' | 'user';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_users',
    'manage_transactions',
    'manage_settings',
    'export_data',
    'view_reports'
  ],
  manager: [
    'view_dashboard',
    'manage_transactions',
    'view_reports',
    'export_data'
  ],
  accountant: [
    'view_dashboard',
    'manage_transactions',
    'view_reports'
  ],
  user: [
    'view_dashboard',
    'view_reports'
  ]
};

export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

export const validateMultiplePermissions = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};
