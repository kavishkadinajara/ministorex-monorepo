-- ============================================
-- MiniStoreX - Add Stores & Locations Screens
-- Run this AFTER 003_seed_initial_data.sql
-- ============================================

-- ============================================
-- 1. ADD LOCATIONS SCREEN TO ADMINISTRATION MENU
-- ============================================

-- First, add the locations screen
INSERT INTO public.screens (code, name, route_path, icon_tag, order_no, menu_id)
SELECT 
    'ADMIN_LOCATIONS',
    'Locations',
    '/dashboard/admin/locations',
    'MapPin',
    2, -- After stores
    m.id
FROM public.menus m
WHERE m.code = 'ADMINISTRATION'
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    route_path = EXCLUDED.route_path,
    icon_tag = EXCLUDED.icon_tag;

-- ============================================
-- 2. ADD PERMISSIONS FOR STORES
-- ============================================

-- Make sure stores screen exists and get permissions
INSERT INTO public.permissions (code, name, order_no, screen_id)
SELECT 
    p.code, p.name, p.order_no, sc.id
FROM (VALUES
    ('stores.view', 'View Stores List', 1),
    ('stores.view_detail', 'View Store Details', 2),
    ('stores.create', 'Create Store', 3),
    ('stores.edit', 'Edit Store', 4),
    ('stores.delete', 'Delete/Deactivate Store', 5)
) AS p(code, name, order_no)
CROSS JOIN public.screens sc
WHERE sc.code = 'ADMIN_STORES'
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    order_no = EXCLUDED.order_no;

-- ============================================
-- 3. ADD PERMISSIONS FOR LOCATIONS
-- ============================================

INSERT INTO public.permissions (code, name, order_no, screen_id)
SELECT 
    p.code, p.name, p.order_no, sc.id
FROM (VALUES
    ('locations.view', 'View Locations List', 1),
    ('locations.view_detail', 'View Location Details', 2),
    ('locations.create', 'Create Location', 3),
    ('locations.edit', 'Edit Location', 4),
    ('locations.delete', 'Delete/Deactivate Location', 5)
) AS p(code, name, order_no)
CROSS JOIN public.screens sc
WHERE sc.code = 'ADMIN_LOCATIONS'
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    order_no = EXCLUDED.order_no;

-- ============================================
-- 4. GRANT ALL NEW PERMISSIONS TO SUPER ADMIN
-- ============================================

INSERT INTO public.role_permissions (role_id, permission_id, is_active)
SELECT 
    r.id,
    p.id,
    true
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Super Administrator'
AND p.code IN (
    'stores.view', 'stores.view_detail', 'stores.create', 'stores.edit', 'stores.delete',
    'locations.view', 'locations.view_detail', 'locations.create', 'locations.edit', 'locations.delete'
)
AND NOT EXISTS (
    SELECT 1 FROM public.role_permissions rp 
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);

-- ============================================
-- 5. VERIFICATION QUERY
-- ============================================
SELECT 
    m.name as menu_name,
    s.name as screen_name,
    s.route_path,
    p.code as permission_code,
    p.name as permission_name
FROM public.screens s
JOIN public.menus m ON s.menu_id = m.id
LEFT JOIN public.permissions p ON p.screen_id = s.id
WHERE m.code = 'ADMINISTRATION'
ORDER BY s.order_no, p.order_no;
