import { createClient } from "../client";
import type { Location, LocationInput, Store, StoreInput } from "../types/database";

// ============================================
// STORES API
// ============================================

export async function getStores(options?: { 
  onlyActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  
  let query = supabase
    .from("stores")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (options?.onlyActive !== false) {
    query = query.eq("is_active", true);
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,code.ilike.%${options.search}%`);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data as Store[], count };
}

export async function getStoreById(id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Store;
}

export async function createStore(store: StoreInput) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("stores")
    .insert({
      ...store,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

export async function updateStore(id: string, store: Partial<StoreInput>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("stores")
    .update({
      ...store,
      modified_by: user?.id,
      modified_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

export async function deleteStore(id: string) {
  // Soft delete - set is_active to false
  return updateStore(id, { is_active: false });
}

// ============================================
// LOCATIONS API
// ============================================

export async function getLocations(options?: {
  storeId?: string;
  onlyActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();
  
  let query = supabase
    .from("locations")
    .select("*, store:stores(*)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (options?.storeId) {
    query = query.eq("store_id", options.storeId);
  }

  if (options?.onlyActive !== false) {
    query = query.eq("is_active", true);
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,code.ilike.%${options.search}%`);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data as Location[], count };
}

export async function getLocationById(id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("locations")
    .select("*, store:stores(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Location;
}

export async function createLocation(location: LocationInput) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("locations")
    .insert({
      ...location,
      created_by: user?.id,
    })
    .select("*, store:stores(*)")
    .single();

  if (error) throw error;
  return data as Location;
}

export async function updateLocation(id: string, location: Partial<LocationInput>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("locations")
    .update({
      ...location,
      modified_by: user?.id,
      modified_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*, store:stores(*)")
    .single();

  if (error) throw error;
  return data as Location;
}

export async function deleteLocation(id: string) {
  // Soft delete - set is_active to false
  return updateLocation(id, { is_active: false });
}
