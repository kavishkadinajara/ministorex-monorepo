-- ============================================
-- MiniStoreX - Create Super Admin
-- Run this AFTER you have a user registered
-- ============================================

-- Step 1: Create a global Super Admin role (no store scope)
INSERT INTO public.roles (name, description, store_id, location_id, role_level_id, is_active)
SELECT 
    'Super Administrator',
    'Full system access - all stores, all permissions',
    NULL,  -- No store scope = global
    NULL,  -- No location scope
    rl.id,
    true
FROM public.role_levels rl
WHERE rl.name = 'Super Admin'
ON CONFLICT DO NOTHING;

-- Step 2: Grant ALL permissions to Super Admin role
INSERT INTO public.role_permissions (role_id, permission_id, is_active)
SELECT 
    r.id,
    p.id,
    true
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Super Administrator'
AND r.role_level_id = (SELECT id FROM public.role_levels WHERE name = 'Super Admin')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================
-- Step 3: Assign Super Admin to a specific user
-- REPLACE 'your-email@example.com' with the actual email
-- ============================================

-- Option A: Assign by email (run this with your actual email)
DO $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
BEGIN
    -- Get user ID by email (CHANGE THIS EMAIL!)
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'your-email@example.com';  -- ⚠️ CHANGE THIS!
    
    -- Get Super Admin role ID
    SELECT id INTO v_role_id 
    FROM public.roles 
    WHERE name = 'Super Administrator';
    
    -- Assign role to user
    IF v_user_id IS NOT NULL AND v_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, is_active)
        VALUES (v_user_id, v_role_id, true)
        ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = true;
        
        RAISE NOTICE 'Super Admin role assigned successfully!';
    ELSE
        RAISE EXCEPTION 'User or role not found. Please check the email address.';
    END IF;
END $$;

-- ============================================
-- Verification Query - Check if assignment worked
-- ============================================
SELECT 
    u.email,
    r.name as role_name,
    rl.name as role_level,
    ur.is_active
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
JOIN public.roles r ON ur.role_id = r.id
JOIN public.role_levels rl ON r.role_level_id = rl.id
WHERE rl.name = 'Super Admin';
