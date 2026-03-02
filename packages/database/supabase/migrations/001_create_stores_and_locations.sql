-- ============================================
-- MiniStoreX Database Schema
-- Migration: 001_create_stores_and_locations
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'LKR',
    enable_credit BOOLEAN DEFAULT true,
    enable_stock_management BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE public.stores IS 'Stores/Shops in the MiniStoreX system';

-- ============================================
-- 2. LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_by UUID REFERENCES auth.users(id),
    modified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, code)
);

COMMENT ON TABLE public.locations IS 'Locations/Branches within a store';

-- ============================================
-- 3. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_stores_code ON public.stores(code);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON public.stores(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_store_id ON public.locations(store_id);
CREATE INDEX IF NOT EXISTS idx_locations_is_active ON public.locations(is_active);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Stores: Allow authenticated users to read active stores
CREATE POLICY "Users can view active stores" ON public.stores
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Stores: Super admins can do everything
CREATE POLICY "Super admins can manage stores" ON public.stores
    FOR ALL
    TO authenticated
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

-- Locations: Users can view locations of their stores
CREATE POLICY "Users can view locations" ON public.locations
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Locations: Super admins can manage
CREATE POLICY "Super admins can manage locations" ON public.locations
    FOR ALL
    TO authenticated
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
