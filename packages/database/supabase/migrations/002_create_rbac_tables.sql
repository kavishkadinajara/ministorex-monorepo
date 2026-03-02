-- ============================================
-- MiniStoreX Database Schema
-- Migration: 002_create_rbac_tables
-- ============================================

-- ============================================
-- 1. ROLE LEVELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.role_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    level_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.role_levels IS 'Role hierarchy levels (Super Admin, Store Admin, etc.)';

-- ============================================
-- 2. MENUS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon_tag VARCHAR(50),
    order_no INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.menus IS 'Navigation menu groups';

-- ============================================
-- 3. SCREENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES public.menus(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    route_path VARCHAR(255),
    icon_tag VARCHAR(50),
    order_no INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.screens IS 'Individual screens/pages in the application';

-- ============================================
-- 4. PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screen_id UUID REFERENCES public.screens(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    order_no INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.permissions IS 'Granular permissions (e.g., products.read, products.write)';

-- ============================================
-- 5. ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    role_level_id UUID NOT NULL REFERENCES public.role_levels(id),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.roles IS 'User roles scoped to store/location';

-- ============================================
-- 6. ROLE_PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

COMMENT ON TABLE public.role_permissions IS 'Mapping between roles and permissions';

-- ============================================
-- 7. USER_ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

COMMENT ON TABLE public.user_roles IS 'User role assignments';

-- ============================================
-- 8. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_roles_store_id ON public.roles(store_id);
CREATE INDEX IF NOT EXISTS idx_roles_location_id ON public.roles(location_id);
CREATE INDEX IF NOT EXISTS idx_roles_role_level_id ON public.roles(role_level_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_screens_menu_id ON public.screens(menu_id);
CREATE INDEX IF NOT EXISTS idx_permissions_screen_id ON public.permissions(screen_id);

-- ============================================
-- 9. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.role_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated users
CREATE POLICY "Authenticated users can view role_levels" ON public.role_levels
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Authenticated users can view menus" ON public.menus
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Authenticated users can view screens" ON public.screens
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Authenticated users can view permissions" ON public.permissions
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Authenticated users can view roles" ON public.roles
    FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Authenticated users can view role_permissions" ON public.role_permissions
    FOR SELECT TO authenticated USING (is_active = true);

-- Users can only view their own user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() AND is_active = true);

-- Super admins can view all user_roles
CREATE POLICY "Super admins can view all user_roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            JOIN public.role_levels rl ON r.role_level_id = rl.id
            WHERE ur.user_id = auth.uid()
            AND rl.name = 'Super Admin'
            AND ur.is_active = true
        )
    );
