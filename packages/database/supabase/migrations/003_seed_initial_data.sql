-- ============================================
-- MiniStoreX Database Schema
-- Migration: 003_seed_initial_data
-- ============================================

-- ============================================
-- 1. SEED ROLE LEVELS
-- ============================================
INSERT INTO public.role_levels (name, description, level_order) VALUES
    ('Super Admin', 'Full system access, can manage all stores and users', 1),
    ('Store Admin', 'Full access to assigned store(s)', 2),
    ('Manager', 'Manage store operations, staff, and reports', 3),
    ('Cashier', 'POS and basic customer operations', 4),
    ('Stock Manager', 'Inventory and stock management', 5),
    ('Viewer', 'Read-only access to reports', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. SEED MENUS
-- ============================================
INSERT INTO public.menus (code, name, icon_tag, order_no) VALUES
    ('DASHBOARD', 'Dashboard', 'LayoutDashboard', 1),
    ('STORE', 'Store Operations', 'Store', 2),
    ('INVENTORY', 'Inventory', 'Package', 3),
    ('CUSTOMERS', 'Customers', 'Users', 4),
    ('CREDIT', 'Credit / Naya', 'CreditCard', 5),
    ('REPORTS', 'Reports', 'BarChart3', 6),
    ('ADMINISTRATION', 'Administration', 'Settings', 7)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 3. SEED SCREENS
-- ============================================
INSERT INTO public.screens (code, name, route_path, icon_tag, order_no, menu_id)
SELECT 
    s.code, s.name, s.route_path, s.icon_tag, s.order_no, m.id
FROM (VALUES
    -- Dashboard
    ('DASHBOARD_HOME', 'Dashboard Home', '/dashboard', 'LayoutDashboard', 1, 'DASHBOARD'),
    
    -- Store Operations
    ('POS', 'Point of Sale', '/dashboard/pos', 'ShoppingCart', 1, 'STORE'),
    ('SALES_HISTORY', 'Sales History', '/dashboard/sales', 'Receipt', 2, 'STORE'),
    
    -- Inventory
    ('PRODUCTS', 'Products', '/dashboard/inventory/products', 'Package', 1, 'INVENTORY'),
    ('STOCK_IN', 'Stock In', '/dashboard/inventory/stock-in', 'PackagePlus', 2, 'INVENTORY'),
    ('STOCK_OUT', 'Stock Out', '/dashboard/inventory/stock-out', 'PackageMinus', 3, 'INVENTORY'),
    ('STOCK_ADJUSTMENTS', 'Adjustments', '/dashboard/inventory/adjustments', 'PackageSearch', 4, 'INVENTORY'),
    
    -- Customers
    ('CUSTOMERS_LIST', 'Customer List', '/dashboard/customers', 'Users', 1, 'CUSTOMERS'),
    ('CUSTOMER_DETAIL', 'Customer Detail', '/dashboard/customers/:id', 'User', 2, 'CUSTOMERS'),
    
    -- Credit/Naya
    ('CREDIT_LEDGER', 'Credit Ledger', '/dashboard/credit', 'CreditCard', 1, 'CREDIT'),
    ('CREDIT_PAYMENTS', 'Credit Payments', '/dashboard/credit/payments', 'Wallet', 2, 'CREDIT'),
    
    -- Reports
    ('REPORT_DAILY', 'Daily Summary', '/dashboard/reports/daily', 'Calendar', 1, 'REPORTS'),
    ('REPORT_SALES', 'Sales Report', '/dashboard/reports/sales', 'TrendingUp', 2, 'REPORTS'),
    ('REPORT_STOCK', 'Stock Report', '/dashboard/reports/stock', 'Boxes', 3, 'REPORTS'),
    ('REPORT_CREDIT', 'Credit Report', '/dashboard/reports/credit', 'FileText', 4, 'REPORTS'),
    
    -- Administration
    ('ADMIN_STORES', 'Stores', '/dashboard/admin/stores', 'Building2', 1, 'ADMINISTRATION'),
    ('ADMIN_USERS', 'Users', '/dashboard/admin/users', 'UserCog', 2, 'ADMINISTRATION'),
    ('ADMIN_ROLES', 'Roles & Permissions', '/dashboard/admin/roles', 'Shield', 3, 'ADMINISTRATION'),
    ('ADMIN_SETTINGS', 'Settings', '/dashboard/admin/settings', 'Settings', 4, 'ADMINISTRATION')
) AS s(code, name, route_path, icon_tag, order_no, menu_code)
JOIN public.menus m ON m.code = s.menu_code
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 4. SEED PERMISSIONS
-- ============================================
INSERT INTO public.permissions (code, name, order_no, screen_id)
SELECT 
    p.code, p.name, p.order_no, sc.id
FROM (VALUES
    -- Dashboard
    ('dashboard.view', 'View Dashboard', 1, 'DASHBOARD_HOME'),
    
    -- POS
    ('pos.view', 'View POS', 1, 'POS'),
    ('pos.create_sale', 'Create Sale', 2, 'POS'),
    ('pos.apply_discount', 'Apply Discount', 3, 'POS'),
    ('pos.void_sale', 'Void Sale', 4, 'POS'),
    
    -- Sales History
    ('sales.view', 'View Sales', 1, 'SALES_HISTORY'),
    ('sales.refund', 'Process Refund', 2, 'SALES_HISTORY'),
    ('sales.export', 'Export Sales', 3, 'SALES_HISTORY'),
    
    -- Products
    ('products.view', 'View Products', 1, 'PRODUCTS'),
    ('products.create', 'Create Product', 2, 'PRODUCTS'),
    ('products.edit', 'Edit Product', 3, 'PRODUCTS'),
    ('products.delete', 'Delete Product', 4, 'PRODUCTS'),
    
    -- Stock In
    ('stock_in.view', 'View Stock In', 1, 'STOCK_IN'),
    ('stock_in.create', 'Create Stock In', 2, 'STOCK_IN'),
    
    -- Stock Out
    ('stock_out.view', 'View Stock Out', 1, 'STOCK_OUT'),
    ('stock_out.create', 'Create Stock Out', 2, 'STOCK_OUT'),
    
    -- Adjustments
    ('adjustments.view', 'View Adjustments', 1, 'STOCK_ADJUSTMENTS'),
    ('adjustments.create', 'Create Adjustment', 2, 'STOCK_ADJUSTMENTS'),
    
    -- Customers
    ('customers.view', 'View Customers', 1, 'CUSTOMERS_LIST'),
    ('customers.create', 'Create Customer', 2, 'CUSTOMERS_LIST'),
    ('customers.edit', 'Edit Customer', 3, 'CUSTOMERS_LIST'),
    ('customers.delete', 'Delete Customer', 4, 'CUSTOMERS_LIST'),
    
    -- Credit
    ('credit.view', 'View Credit Ledger', 1, 'CREDIT_LEDGER'),
    ('credit.add_entry', 'Add Credit Entry', 2, 'CREDIT_LEDGER'),
    ('credit.record_payment', 'Record Payment', 3, 'CREDIT_PAYMENTS'),
    
    -- Reports
    ('reports.daily', 'View Daily Report', 1, 'REPORT_DAILY'),
    ('reports.sales', 'View Sales Report', 1, 'REPORT_SALES'),
    ('reports.stock', 'View Stock Report', 1, 'REPORT_STOCK'),
    ('reports.credit', 'View Credit Report', 1, 'REPORT_CREDIT'),
    
    -- Administration
    ('stores.view', 'View Stores', 1, 'ADMIN_STORES'),
    ('stores.create', 'Create Store', 2, 'ADMIN_STORES'),
    ('stores.edit', 'Edit Store', 3, 'ADMIN_STORES'),
    ('stores.delete', 'Delete Store', 4, 'ADMIN_STORES'),
    
    ('users.view', 'View Users', 1, 'ADMIN_USERS'),
    ('users.create', 'Create User', 2, 'ADMIN_USERS'),
    ('users.edit', 'Edit User', 3, 'ADMIN_USERS'),
    ('users.delete', 'Delete User', 4, 'ADMIN_USERS'),
    
    ('roles.view', 'View Roles', 1, 'ADMIN_ROLES'),
    ('roles.create', 'Create Role', 2, 'ADMIN_ROLES'),
    ('roles.edit', 'Edit Role', 3, 'ADMIN_ROLES'),
    ('roles.delete', 'Delete Role', 4, 'ADMIN_ROLES'),
    
    ('settings.view', 'View Settings', 1, 'ADMIN_SETTINGS'),
    ('settings.edit', 'Edit Settings', 2, 'ADMIN_SETTINGS')
) AS p(code, name, order_no, screen_code)
JOIN public.screens sc ON sc.code = p.screen_code
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 5. HELPER FUNCTION: Check User Permission
-- ============================================
CREATE OR REPLACE FUNCTION public.has_permission(permission_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND rp.is_active = true
        AND p.is_active = true
        AND p.code = permission_code
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. HELPER FUNCTION: Get User Permissions
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_permissions()
RETURNS TABLE(permission_code TEXT, screen_code TEXT, menu_code TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.code AS permission_code,
        sc.code AS screen_code,
        m.code AS menu_code
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    JOIN public.screens sc ON p.screen_id = sc.id
    JOIN public.menus m ON sc.menu_id = m.id
    WHERE ur.user_id = auth.uid()
    AND ur.is_active = true
    AND rp.is_active = true
    AND p.is_active = true
    AND sc.is_active = true
    AND m.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. HELPER FUNCTION: Is Super Admin
-- ============================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        JOIN public.role_levels rl ON r.role_level_id = rl.id
        WHERE ur.user_id = auth.uid()
        AND rl.name = 'Super Admin'
        AND ur.is_active = true
        AND r.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
