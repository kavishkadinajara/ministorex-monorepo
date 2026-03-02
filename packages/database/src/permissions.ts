import { createClient } from "./client";
import type { PermissionCode } from "./types/database";

// ============================================
// Permission Check Hooks and Utilities
// ============================================

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(permissionCode: PermissionCode): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('has_permission', {
    permission_code: permissionCode,
  });

  if (error) {
    console.error('Error checking permission:', error);
    return false;
  }

  return data === true;
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<{
  permission_code: string;
  screen_code: string;
  menu_code: string;
}[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_permissions');

  if (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }

  return data || [];
}

/**
 * Check if current user is a Super Admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('is_super_admin');

  if (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }

  return data === true;
}

/**
 * Get user's accessible menu items based on permissions
 */
export async function getAccessibleMenus() {
  const supabase = createClient();

  const permissions = await getUserPermissions();
  const menuCodes = [...new Set(permissions.map((p) => p.menu_code))];

  const { data: menus, error } = await supabase
    .from('menus')
    .select(`
      *,
      screens (
        *,
        permissions (*)
      )
    `)
    .in('code', menuCodes)
    .eq('is_active', true)
    .order('order_no');

  if (error) {
    console.error('Error fetching menus:', error);
    return [];
  }

  return menus || [];
}
