// ============================================
// MiniStoreX Database Types
// Auto-generated from Supabase schema
// ============================================

// ============================================
// 1. CORE ENTITIES
// ============================================

export interface Store {
  id: string;
  code: string;
  name: string;
  business_type?: string;
  address?: string;
  city?: string;
  phone?: string;
  currency: string;
  enable_credit: boolean;
  enable_stock_management: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  modified_by?: string;
  modified_at: string;
}

export interface Location {
  id: string;
  store_id: string;
  code: string;
  name: string;
  address?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  modified_by?: string;
  modified_at: string;
  // Relations
  store?: Store;
}

// ============================================
// 2. RBAC ENTITIES
// ============================================

export interface RoleLevel {
  id: string;
  name: string;
  description?: string;
  level_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Menu {
  id: string;
  code: string;
  name: string;
  icon_tag?: string;
  order_no: number;
  is_active: boolean;
  // Relations
  screens?: Screen[];
}

export interface Screen {
  id: string;
  menu_id?: string;
  code: string;
  name: string;
  route_path?: string;
  icon_tag?: string;
  order_no: number;
  is_active: boolean;
  // Relations
  menu?: Menu;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  screen_id?: string;
  code: string;
  name: string;
  order_no: number;
  is_active: boolean;
  // Relations
  screen?: Screen;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  store_id?: string;
  location_id?: string;
  role_level_id: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  modified_by?: string;
  modified_at: string;
  // Relations
  store?: Store;
  location?: Location;
  role_level?: RoleLevel;
  permissions?: Permission[];
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  is_active: boolean;
  created_at: string;
  // Relations
  role?: Role;
  permission?: Permission;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  modified_by?: string;
  modified_at: string;
  // Relations
  role?: Role;
}

// ============================================
// 3. USER PROFILE (extends Supabase auth.users)
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  // Computed
  roles?: UserRole[];
  permissions?: string[];
}

// ============================================
// 4. FORM INPUT TYPES
// ============================================

export type StoreInput = Omit<Store, 'id' | 'created_at' | 'created_by' | 'modified_at' | 'modified_by'>;
export type LocationInput = Omit<Location, 'id' | 'created_at' | 'created_by' | 'modified_at' | 'modified_by' | 'store'>;
export type RoleInput = Omit<Role, 'id' | 'created_at' | 'created_by' | 'modified_at' | 'modified_by' | 'store' | 'location' | 'role_level' | 'permissions'>;

// ============================================
// 5. PERMISSION CODES (for type-safe checks)
// ============================================

export type PermissionCode =
  // Dashboard
  | 'dashboard.view'
  // POS
  | 'pos.view'
  | 'pos.create_sale'
  | 'pos.apply_discount'
  | 'pos.void_sale'
  // Sales
  | 'sales.view'
  | 'sales.refund'
  | 'sales.export'
  // Products
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  // Stock
  | 'stock_in.view'
  | 'stock_in.create'
  | 'stock_out.view'
  | 'stock_out.create'
  | 'adjustments.view'
  | 'adjustments.create'
  // Customers
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  // Credit
  | 'credit.view'
  | 'credit.add_entry'
  | 'credit.record_payment'
  // Reports
  | 'reports.daily'
  | 'reports.sales'
  | 'reports.stock'
  | 'reports.credit'
  // Administration
  | 'stores.view'
  | 'stores.create'
  | 'stores.edit'
  | 'stores.delete'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'roles.view'
  | 'roles.create'
  | 'roles.edit'
  | 'roles.delete'
  | 'settings.view'
  | 'settings.edit';
