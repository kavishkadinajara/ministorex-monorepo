-- ============================================
-- FIX: Infinite Recursion in user_roles RLS Policy
-- Run this to fix the policy error
-- ============================================

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can view all user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage stores" ON public.stores;
DROP POLICY IF EXISTS "Super admins can manage locations" ON public.locations;

-- Step 2: Create a security definer function to check super admin
-- This avoids the recursive RLS check
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN := false;
BEGIN
    -- Use a direct query that bypasses RLS
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        INNER JOIN public.roles r ON ur.role_id = r.id
        INNER JOIN public.role_levels rl ON r.role_level_id = rl.id
        WHERE ur.user_id = auth.uid()
        AND rl.name = 'Super Admin'
        AND ur.is_active = true
        AND r.is_active = true
    ) INTO is_admin;
    
    RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 3: Recreate user_roles policies without recursion
-- Allow users to see their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Allow insert/update/delete for service role only (admin operations through API)
CREATE POLICY "Service role can manage user_roles" ON public.user_roles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Step 4: Fix stores policies
CREATE POLICY "Super admins full access to stores" ON public.stores
    FOR ALL
    TO authenticated
    USING (public.check_is_super_admin())
    WITH CHECK (public.check_is_super_admin());

-- Step 5: Fix locations policies
CREATE POLICY "Super admins full access to locations" ON public.locations
    FOR ALL
    TO authenticated
    USING (public.check_is_super_admin())
    WITH CHECK (public.check_is_super_admin());

-- Step 6: Add policy for authenticated users to read stores/locations
CREATE POLICY "Authenticated users can read active stores" ON public.stores
    FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can read active locations" ON public.locations
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Verify the function works
SELECT public.check_is_super_admin();
